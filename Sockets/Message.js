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
    if (!this.socket.handshake.session.name) {
        this.socket.handshake.session.name = text;
        this.socket.emit('msg_out', { message: 'Very well ' + text + '. When we meet again what word shall you say, such that I may know you?' });

    } else if (this.socket.handshake.session.name && !this.socket.handshake.session.password) {
        this.socket.handshake.session.password = text
        this.socket.emit('msg_out', { message: 'I will remember it. What do you look like?' });

    } else if (this.socket.handshake.session.name && this.socket.handshake.session.password && !this.socket.handshake.session.description) {
        this.socket.handshake.session.description = text;

        let user = new UserResource({
            name: this.socket.handshake.session.name,
            password: this.socket.handshake.session.password,
            description: this.socket.handshake.session.description
        });

        user.save((res) => {
            console.log('created new user', user);
            this.socket.emit('msg_out', { message: 'A frightening continence. Let us begin.' });
        });

    } else if (this.socket.handshake.session.name && this.socket.handshake.session.password && this.socket.handshake.session.description) {
        this.app.parseText({ user: this.socket.id, text: text });
    }
}

module.exports = Message;