http://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app?rq=1

var Message = require('./Message');
var Auth = require('socketio-auth');
var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

module.exports = (Game, io) => {

    Game.socketMap = {};

    Auth(io, {
        authenticate: function (socket, data, callback) {
            //get credentials sent by the client 
            console.log('--- User authenticating', data);

            var password = data.password;

            UserResource.findOne({ slugName: data.slugName }).exec(function (err, user) {
                if (user) {
                    user._.password.compare(data.password, function (err, isMatch) {
                        if (!err && isMatch) {
                            socket.handshake.session.user = user;
                            socket.handshake.session.user.socketId = socket.id;
                            return callback(null, true);
                        } else {
                            socket.handshake.session.name = false;
                            socket.handshake.session.password = false;
                            socket.handshake.session.description = false;
                            return callback(new Error('Incorrect email or password'));
                        }
                    });
                } else {
                    socket.handshake.session.name = false;
                    socket.handshake.session.password = false;
                    socket.handshake.session.description = false;
                    return callback(new Error("User not found"));
                }
            });
        },
        postAuthenticate: function (socket, data) {
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
        },
        disconnect: function (socket) {
            // remove socket from array here
            console.log('--- User disconnected');
        },
        timeout: 'none'
    });

    io.on('connect', function (socket) {

        console.log('--- User connected in normal conection handler');
        socket.on('join', function (msg) {
            // not really sure what this is...
            console.log('join', msg);
        });

        if (!socket.auth) {
            socket.handshake.session.name = false;
            socket.handshake.session.password = false;
            socket.handshake.session.description = false;
            socket.emit('msg_out', { message: 'Welcome traveler. You are not known to me. What should I call you?' });
        } else {
            socket.emit('msg_out', { message: 'Welcome old friend.' });
        }

        socket.on('pre_auth', function (text) {

            if (!socket.handshake.session.name) {
                socket.handshake.session.name = text;
                socket.emit('msg_out', { message: 'Very well ' + text + '. When we meet again what word shall you say, such that I may know you?' });

            } else if (socket.handshake.session.name && !socket.handshake.session.password) {
                socket.handshake.session.password = text
                socket.emit('msg_out', { message: 'I will remember it. What do you look like?' });

            } else if (socket.handshake.session.name && socket.handshake.session.password && !socket.handshake.session.description) {
                socket.handshake.session.description = text;

                let slugName = socket.handshake.session.name.replace(' ', '_');

                let user = new UserResource({
                    name: socket.handshake.session.name,
                    lat: 1,
                    long: 1,
                    slugName: slugName,
                    password: socket.handshake.session.password,
                    description: socket.handshake.session.description
                });

                user.save((res) => {
                    Game.socketMap[user._id] = socket.id;
                    console.log('New User:', user);
                    socket.emit('msg_out', { message: 'A frightening continence.' });
                    socket.emit('ready_to_auth', { user , password: socket.handshake.session.password });
                });
            }
        });
    });

    // set up general response handler for the whole game
    Game.addResponseHandler(function (resp) {
        console.log('Respond:', resp.user.name + '=>' + resp.message);
        io.sockets.connected[Game.socketMap[resp.user._id]].emit('msg_out', resp);
    });
};