http://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app?rq=1

var Message = require('./Message');
    // Theme = require('./Theme');

module.exports = (Game, io) => {

    Game.allSockets = [];

    io.on('connect', function (socket) {

        console.log('--- User connected', socket.handshake.session, socket.id);

        // Keep track of the sockets
        Game.allSockets.push(socket);
        
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

        socket.on('disconnect', function () {
            // remove socket from array here
            console.log('--- User disconnected');
        });

        socket.on('join', function (msg) {
            // not really sure what this is...
            console.log('join', msg);
        });

        if (!socket.handshake.session.userId) {
            socket.handshake.session.name = false;
            socket.handshake.session.password = false;
            socket.handshake.session.description = false;
            socket.emit('msg_out', { message: 'Welcome traveler. You are not known to me. What should I call you?' });
        } else {
            socket.emit('msg_out', { message: 'Welcome old friend.' });
        }

    });

    // set up general response handler for the whole game
    Game.addResponseHandler(function (resp) {        
        console.log('resp', resp, resp.user.socketId);
        io.sockets.connected[resp.user.socketId].emit('msg_out', resp);
    });
};