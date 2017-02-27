
module.exports = (Game, keystone) => {

    var socket = require('socket.io-client')('http://localhost');
    
    console.log(socket);

    socket.on('connect', function(){
        console.log('connected!')
    });
    
    socket.on('event', function(data){
        console.log('event', data)
    });

    socket.on('disconnect', function(){
        console.log('connected!')
    });
    
    Game.addResponseHandler((resp)=>{
        // socket send
    });

    // socket listen here, and call Game methods
}