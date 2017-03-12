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
    let self = this;
    console.log('msg_in: ', text);
    UserResource.findOne({slugName: this.socket.handshake.session.user.slugName},(err, user)=>{
        if(user && !err){
            try {
                self.app.parseText({ user, text });
            } catch (error) {
                console.error('Parse error ', error)
                self.handler.msg_out({text:'Crap. Something broke. ' + error, action: 'msg_in'});
            }
        } else {
            console.log('Error getting user during message: ', err)
            self.handler.msg_out({text:'I seem to have forgotten who you are!', action: 'msg_in'});
        }
    });
}

module.exports = Message;