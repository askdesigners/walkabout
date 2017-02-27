import {buildMap} from '../places/index';
import {buildActors} from '../actors/index';
import {buildThings} from '../things/index';
import {buildActions} from '../actions/index';
import Game from './Game';

var Gameinit = function(gameData){
  
  var {placesData, actorsData, thingsData, startPosition, playerName, themes} = gameData;
  
  return new Game({
    playerName: playerName,
    currentPosition: startPosition,
    map: buildMap(placesData),
    things: buildThings(thingsData),
    actors: buildActors(actorsData),
    themes: themes
  });
}

export default Gameinit;