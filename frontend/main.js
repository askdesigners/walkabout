import G from './game/index';
import {dimensions,definitions} from './gameData/places';
import descriptions from './gameData/placeDescriptions';
import {things} from './gameData/things';
import {themes} from './gameData/colorThemes';
import io from 'socket.io-client';

var socket = io.connect('http://localhost:3000');
    socket.on('connect', function(data) {
        console.log('connect')
        socket.emit('join', 'Hello World from client');
    });

window.game = G({
  playerName:'Oliver',
  placesData:{dimensions,descriptions,definitions}, 
  actorsData:{}, 
  thingsData:things, 
  startPosition:'a1',
  themes: themes
});

var messageList = document.getElementById("output");
var form = document.getElementById('input');
var inputField = document.getElementById('inputBox');

window.game.addResponseHandler(function(resp){
  // console.log(resp);
  if(resp.message !== undefined){
    var newP = document.createElement("p");
    newP.classList.add('response');
    newP.innerHTML = resp.message;
    messageList.appendChild(newP);
    messageList.scrollTop = messageList.scrollHeight;
  }
});

window.game.addThemeHandler(function(theme){
  messageList.style.background = theme.bg;
  messageList.style.color = theme.txt;
});

form.addEventListener('submit', function(event) {
    event.stopPropagation();
    event.preventDefault();
    
    var newP = document.createElement("p");
    newP.classList.add('request');
    newP.innerHTML = inputField.value;
    messageList.appendChild(newP);
    messageList.scrollTop = messageList.scrollHeight;
    
    window.game.parseText(inputField.value);
    inputField.value = '';
});