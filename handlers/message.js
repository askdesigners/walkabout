var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

module.exports = (Game, io) => {

    io.on('connect', function (socket) {
        console.log('--- User connected', socket.handshake.session, socket.id);

        if (!socket.handshake.session.userId){
            socket.handshake.session.hasName = false;
            socket.emit('msg_out', 'Welcome traveler. You are not known to me. What should I call you?');
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
            Game.parseText({user: socket.id, text: text});
        });
        
    });
    
    Game.addResponseHandler(function(resp) {
        console.log('resp',resp, io.sockets.connected[resp.user]);
        io.sockets.connected[resp.user].emit('msg_out', resp);
    });


    // socket listen here, and call Game methods
}