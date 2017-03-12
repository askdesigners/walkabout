import io from 'socket.io-client';

var messageList = document.getElementById("output");
var form = document.getElementById('input');
var inputField = document.getElementById('inputBox');
var socket = io.connect('http://localhost:3000');
var nextAction = 'pre_auth';

form.addEventListener('submit', function (event) {
    event.stopPropagation();
    event.preventDefault();
    
    let sendValue = inputField.value;
    
    if(sendValue !== ''){
        console.log('[msg_in]', nextAction, {action:'message', text:sendValue});
        socket.emit(nextAction, {action:'message', text:sendValue});

        var newP = document.createElement("p");
        newP.classList.add('request');
        newP.innerHTML = sendValue;
        messageList.appendChild(newP);
        messageList.scrollTop = messageList.scrollHeight;
        inputField.value = '';
    }

});

socket.on('connect', function () {
    console.log('[connected]');
});

socket.on('authenticated', function () {
    console.log('[authenticated]');
    nextAction = 'msg_in';
});

socket.on('unauthorized', function (err) {
    console.log('[authenticate failed] ', err.message);
    var newP = document.createElement("p");
    newP.classList.add('response');
    newP.innerHTML = err.message;
    messageList.appendChild(newP);
    messageList.scrollTop = messageList.scrollHeight;
});

socket.on('ready_to_auth', function (data) {
    console.log('[ready_to_auth]', data);
    if(data.skipCheck){
        socket.emit('authentication', { skipCheck: true });
    } else {
        socket.emit('authentication', { slugName: data.user.slugName, password: data.password });
    }
});

socket.on('msg_out', function (data) {
    console.log('[msg_out]', data);
    nextAction = data.nextAction || nextAction;
    if (data.message !== undefined) {
        var newP = document.createElement("p");
        newP.classList.add('response');
        newP.innerHTML = data.message;
        messageList.appendChild(newP);
        messageList.scrollTop = messageList.scrollHeight;
    }
});