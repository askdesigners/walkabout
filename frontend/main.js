import io from 'socket.io-client';

var messageList = document.getElementById("output");
var form = document.getElementById('input');
var inputField = document.getElementById('inputBox');
var socket = io.connect('http://localhost:3000');
var messageOutName = 'pre_auth';

form.addEventListener('submit', function (event) {
    event.stopPropagation();
    event.preventDefault();

    if(inputField.value !== ''){

        socket.emit(messageOutName, inputField.value);

        var newP = document.createElement("p");
        newP.classList.add('request');
        newP.innerHTML = inputField.value;
        messageList.appendChild(newP);
        messageList.scrollTop = messageList.scrollHeight;
        inputField.value = '';
    }

});

socket.on('connect', function () {
    console.log('connected!');
});

socket.on('authenticated', function () {
    // use the socket as usual 
    console.log('authed!');
    messageOutName = 'msg_in';
});

socket.on('unauthorized', function (err) {
    console.log("There was an error with the authentication:", err.message);
    var newP = document.createElement("p");
    newP.classList.add('response');
    newP.innerHTML = err.message;
    messageList.appendChild(newP);
    messageList.scrollTop = messageList.scrollHeight;
});

socket.on('ready_to_auth', function (data) {
    console.log('ready_to_auth', data);
    socket.emit('authentication', { slugName: data.user.slugName, password: data.password });
});

socket.on('msg_out', function (data) {

    console.log('msg_out', data);

    if (data.message !== undefined) {
        var newP = document.createElement("p");
        newP.classList.add('response');
        newP.innerHTML = data.message;
        messageList.appendChild(newP);
        messageList.scrollTop = messageList.scrollHeight;
    }
});