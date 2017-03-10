http://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app?rq=1

var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

module.exports = (Game, io) => {
    
    Game.allSockets = [];
    
    io.on('connect', function (socket) {
        console.log('--- User connected', socket.handshake.session, socket.id);

        if (!socket.handshake.session.userId) {
            socket.handshake.session.name = false;
            socket.handshake.session.password = false;
            socket.handshake.session.description = false;
            socket.emit('msg_out', { message: 'Welcome traveler. You are not known to me. What should I call you?' });
        } else {
            io.sockets.connected[socket.id].emit('msg', 'Hello old friend.');
        }

        socket.on('join', function (msg) {
            console.log('join', msg);
        });

        socket.on('disconnect', function () {
            console.log('--- User disconnected');
        });

        socket.on('msg_in', function (text) {
            console.log('msg_in', text);

            if (!socket.handshake.session.name) {
                socket.handshake.session.name = text;
                socket.emit('msg_out', { message: 'Very well ' + text + '. When we meet again what word shall you say, such that I may know you?' });

            } else if (socket.handshake.session.name && !socket.handshake.session.password) {
                socket.handshake.session.password = text
                socket.emit('msg_out', { message: 'I will remember it. What do you look like?' });

            } else if (socket.handshake.session.name && socket.handshake.session.password && !socket.handshake.session.description) {
                socket.handshake.session.description = text;

                let user = new UserResource({
                    name: socket.handshake.session.name,
                    password: socket.handshake.session.password,
                    description: socket.handshake.session.description 
                });

                user.save((res)=>{
                    console.log('created new user', user);
                    socket.emit('msg_out', { message: 'A frightening continence. Let us begin.' });
                });

            } else if (socket.handshake.session.name && socket.handshake.session.password && socket.handshake.session.description) {
                Game.parseText({ user: socket.id, text: text });
            }

        });

    });

    Game.addResponseHandler(function (resp) {
        console.log('resp', resp, io.sockets.connected[resp.user]);
        io.sockets.connected[resp.user].emit('msg_out', resp);
    });


    // socket listen here, and call Game methods
}