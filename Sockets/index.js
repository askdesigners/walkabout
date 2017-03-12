http://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app?rq=1

var Message = require('./Message');
var Auth = require('socketio-auth');
var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

module.exports = (Game, io) => {

    function registerHandlers(socket, data) {
        // Keep track of the sockets
        console.log('auth ok, binding listeners', socket.auth);

        // Create event handlers for this socket
        var eventHandlers = {
            message: new Message(Game, socket)
            // theme: new Theme(Game, socket)
        };

        // Bind events to handlers
        for (var category in eventHandlers) {
            var handler = eventHandlers[category].handler;
            for (var event in handler) {
                socket.on(event, handler[event]);
            }
        }
        socket.emit('msg_out', { message: 'Let us begin.' });
    }

    function authenticateUser(socket, data, callback) {

        console.log('--- User authenticating');

        if(data.skipCheck === true) return callback(null, true);
        
        var password = data.password;

        UserResource.findOne({ slugName: data.slugName }).exec(function (err, user) {
            if (user) {
                user._.password.compare(data.password, function (err, isMatch) {
                    if (!err && isMatch) {
                        socket.handshake.session.name = false;
                        socket.handshake.session.password = false;
                        socket.handshake.session.description = false;

                        socket.handshake.session.user = user;
                        socket.handshake.session.user.socketId = socket.id;
                        socket.handshake.session.save();
                        return callback(null, true);
                    } else {
                        socket.handshake.session.name = false;
                        socket.handshake.session.password = false;
                        socket.handshake.session.description = false;
                        return callback(new Error('Something is afoot. ' + err));
                    }
                });
            } else {
                socket.handshake.session.name = false;
                socket.handshake.session.password = false;
                socket.handshake.session.description = false;
                return callback(new Error("User not found"));
            }
        });
    }

    function disconnectUser(socket) {
        // remove socket from array here
        Game.socketMap[socket.handshake.session.user._id] = undefined;
        console.log('--- User disconnected');
    }

    function makeSlugName(name) {
        return name.replace(' ', '_').toLowerCase();
    }

    Game.socketMap = {};

    Auth(io, {
        timeout: 'none',
        authenticate: authenticateUser,
        postAuthenticate: function (socket, data) {
            registerHandlers(socket, data);
        },
        disconnect: disconnectUser
    });

    io.on('connect', function (socket) {

        console.log('--- User connected', socket.handshake.session.user.name || 'no user');

        if (!socket.auth && !socket.handshake.session.user) {
            socket.handshake.session.name = false;
            socket.handshake.session.password = false;
            socket.handshake.session.description = false;
            socket.emit('msg_out', { nextAction: 'pre_auth', message: 'Welcome traveler. You are not known to me. What should I call you?' });
        } else {
            Game.socketMap[socket.handshake.session.user._id] = socket.id;
            socket.emit('msg_out', { nextAction: 'msg_in', message: `Well hello ${socket.handshake.session.user.name}! Very pleased to see you again.` });
            socket.emit('ready_to_auth', { skipCheck: true });
        }

        socket.on('pre_auth', function ({ action, text }) {
            if (!socket.handshake.session.name) {
                UserResource.findOne({ slugName: makeSlugName(text) }, (err, user) => {
                    if (user) {
                        socket.emit('msg_out', { nextAction: 'manual_auth', message: `Ah, Welcome ${user.name}. I mean no disrespect, but please tell me your password.` });
                    } else {
                        socket.handshake.session.name = text;
                        socket.emit('msg_out', { message: 'Very well ' + text + '. When we meet again what word shall you say, such that I may know you?' });
                    }
                });

            } else if (socket.handshake.session.name && !socket.handshake.session.password) {
                socket.handshake.session.password = text
                socket.emit('msg_out', { message: 'I will remember it. What do you look like?' });

            } else if (socket.handshake.session.name && socket.handshake.session.password && !socket.handshake.session.description) {
                socket.handshake.session.description = text;

                let user = new UserResource({
                    name: socket.handshake.session.name,
                    x: 1,
                    y: 1,
                    password: socket.handshake.session.password,
                    description: socket.handshake.session.description
                });

                user.save((res) => {
                    Game.socketMap[user._id] = socket.id;
                    console.log('New User:', user);
                    socket.emit('msg_out', { nextAction: 'msg_in', message: 'A frightening continence.' });
                    socket.emit('ready_to_auth', { user, password: socket.handshake.session.password });
                });
            }
        });
    });

    // set up general response handler for the whole game
    Game.addResponseHandler(function (resp) {
        console.log('Respond:', Object.keys(io.sockets.connected), ' :: ', resp.user.name + ' => ' + resp.message);
        io.sockets.connected[Game.socketMap[resp.user._id]].emit('msg_out', resp);
    });
};