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
function msg_out_all({action, text}) {
    // Broadcast message to all sockets
    this.app.allSockets.emit('message', text);
}

function msg_out({action, text}) {
    // Reply to sender
    this.socket.emit('msg_out', text);
}

function msg_in({action, text}) {
    console.log('msg_in');
    UserResource.findOne({slugName: this.socket.handshake.session.user.slugName}).then((user)=>{
        if(user){
            this.app.parseText({ user, text: text });
        } else {
            msg_out('I seem to have forgotten who you are!');
        }
    });
}

module.exports = Message;