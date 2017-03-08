var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

module.exports = (Game, io) => {

    io.on('connect', function (socket) {
        console.log('--- User connected', socket.handshake.session, socket.id);

        if (!socket.handshake.session.userId){
            socket.emit('msg', 'Welcome traveler. You are not known to me. What should I call you?');
        } else {
            io.sockets.connected[socket.id].emit('msg', 'Hello old friend.');
            // socket.broadcast.to(socket.id).emit('msg', 'Hello old friend.');
        }

        socket.on('join', function (msg) {
            console.log('join', msg);
        });

        socket.on('disconnect', function () {
            console.log('--- User disconnected');
        });
    });

    Game.addResponseHandler((resp) => {
        // socket send
    });

    // socket listen here, and call Game methods
}