
var keystone = require('keystone'),
    UserResource = keystone.list('User').model;


var AuthLib = require('socketio-auth')(){};

Auth(io, {
        authenticate: function (socket, data, callback) {
            //get credentials sent by the client 
            var username = data.username;
            var password = data.password;

            UserResource.findOne({ slugName: emailRegExp }).exec(function (err, user) {
                if (user) {
                    user._.password.compare(password, function (err, isMatch) {
                        if (!err && isMatch) {
                            return callback(null, true);
var Auth = function (Game, socket) {
    this.app = Game;
    this.socket = socket;
                        } else {
                            return callback(new Error('Incorrect email or password'));
                        }
                    });
                } else {
                    return callback(new Error("User not found"));
                }
            });
        }
    });



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

    if (!this.socket.handshake.session.user) {
    
        if (!this.socket.handshake.session.name) {
            this.socket.handshake.session.name = text;
            this.socket.emit('msg_out', { message: 'Very well ' + text + '. When we meet again what word shall you say, such that I may know you?' });

        } else if (this.socket.handshake.session.name && !this.socket.handshake.session.password) {
            this.socket.handshake.session.password = text
            this.socket.emit('msg_out', { message: 'I will remember it. What do you look like?' });

        } else if (this.socket.handshake.session.name && this.socket.handshake.session.password && !this.socket.handshake.session.description) {
            this.socket.handshake.session.description = text;
            
            let slugName = this.socket.handshake.session.name;
            
            slugName = slugName.replace(' ', '_');
            
            let user = new UserResource({
                name: this.socket.handshake.session.name,
                slugName: slugName,
                password: this.socket.handshake.session.password,
                description: this.socket.handshake.session.description
            });

            var self = this;
            
            user.save((res) => {
                console.log('created new user', user);
                delete user.password;
                this.socket.handshake.session.user = {
                    _id: user._id,
                    name: user.name,
                    socketId: self.socket.id
                };

                this.socket.emit('msg_out', { message: 'A frightening continence. Let us begin.' });
            });
        }

    } else {
        console.log(this.socket.handshake.session.user);

        this.app.parseText({ user: this.socket.handshake.session.user, text: text });
    }
}

module.exports = Message;