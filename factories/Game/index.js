let buildMap = require('../Place/index').buildMap;
// let buildActors = require('../actors/index').buildActors;
let buildThings = require('../Thing/index').buildThings;
// let buildActions = require('../actions/index').buildActions;

let Game = require('./Game');

var Gameinit = function(gameData){
  
  var {placesData, actorsData, thingsData, startPosition, playerName, themes} = gameData;
  
  return new Game({
    map: buildMap(placesData),
    things: buildThings(thingsData),
    // actors: buildActors(actorsData),
    themes: themes
  });
}

module.exports = Gameinit;