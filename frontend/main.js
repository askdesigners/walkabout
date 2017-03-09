import io from 'socket.io-client';

var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
  console.log('connect', socket.id)
  socket.emit('join', 'Hello World from client');
});

var messageList = document.getElementById("output");
var form = document.getElementById('input');
var inputField = document.getElementById('inputBox');

socket.on('msg_out', function (data) {
  console.log('msg_out', data)
  if (data.message !== undefined) {
    var newP = document.createElement("p");
    newP.classList.add('response');
    newP.innerHTML = data.message;
    messageList.appendChild(newP);
    messageList.scrollTop = messageList.scrollHeight;
  }
});

form.addEventListener('submit', function (event) {
  event.stopPropagation();
  event.preventDefault();

  var newP = document.createElement("p");
  newP.classList.add('request');
  newP.innerHTML = inputField.value;
  messageList.appendChild(newP);
  messageList.scrollTop = messageList.scrollHeight;

  socket.emit('msg_in', inputField.value);
  inputField.value = '';
});