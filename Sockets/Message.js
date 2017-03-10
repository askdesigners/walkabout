http://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app?rq=1

var keystone = require('keystone'),
    UserResource = keystone.list('User').model;

var Message = function (Game, socket) {
    this.app = Game;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        msg_out_all: msg_out_all.bind(this),
        msg_out: msg_out.bind(this),
        msg_in: msg_in.bind(this)
    };
};

// Events
function msg_out_all(text) {
    // Broadcast message to all sockets
    this.app.allSockets.emit('message', text);
}

function msg_out() {
    // Reply to sender
    this.socket.emit('message', 'PONG!');
}

function msg_in(text) {
    console.log('msg_in', this.socket.handshake.session.user);
    this.app.parseText({ user: this.socket.handshake.session.user, text: text });
}

module.exports = Message;