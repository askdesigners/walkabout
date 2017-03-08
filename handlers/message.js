
module.exports = (Game, app) => {

    var server = require('http').createServer(app);  
    
    var socket = require('socket.io')(server);

    // var socket = require('socket.io-client')('http://localhost');

    socket.on('connect', function(){
        console.log('connected!')
    });
    
    socket.on('event', function(data){
        console.log('event', data)
    });

    socket.on('disconnect', function(){
        console.log('disconnect!')
    });
    
    Game.addResponseHandler((resp)=>{
        // socket send
    });

    // socket listen here, and call Game methods
}