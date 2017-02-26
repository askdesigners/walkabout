let Place = require('./Place');

/**
 * 
 * 
 * @param {any} sn
 * @returns
 */
function toNum(sn){
  let nn = Number(sn);
  if (isNaN(nn)) {
    throw "NaN in making E-W Map";
  }
  return nn;
}

/**
 * 
 * Makes letters able to be compared. A < D
 * 
 * @param {any} ll
 * @returns
 */
function scaleUnicode(ll){
  return ll.charCodeAt() - 96;
}

/**
 * 
 * 
 * @param {any} p
 * @param {any} dimensions
 * @returns
 */
function deriveNeighbors(p, dimensions){
  const blockedTo = p.blockedTo;
  const lat = p.lat;
  const long = p.long;
  let dirs = {};
  
  if(blockedTo.indexOf('s') !=-1  || lat >= dimensions[0]){
    dirs.toS = false;
  } else {
    dirs.toS = [lat + 1, long];
  }
  
  if(blockedTo.indexOf('n') !=-1  || lat == 1){
    dirs.toN = false;
  } else {
    dirs.toN = [lat - 1, long];
  }
  
  if(blockedTo.indexOf('e') !=-1 || long >= dimensions[1]){
    dirs.toE = false;
  } else {
    dirs.toE = [lat, long + 1]
  }
  
  if(blockedTo.indexOf('w') !=-1  || long == 1){
    dirs.toW = false;
  } else {
    dirs.toW = [lat, long - 1]
  }
  return dirs;
}

 /**
  * 
  * 
  * @param {any} placeData
  * @returns
  */
module.exports.buildMap = function(placeData){
  // placeData = {dimensions, definitions, descriptions}
  let map = {};
  for(var p of placeData.definitions){
    let {toN,toE,toS,toW} = deriveNeighbors(p, placeData.dimensions);
    map[p.position] = new Place(p);
    map[p.position].toN = toN;
    map[p.position].toE = toE;
    map[p.position].toS = toS;
    map[p.position].toW = toW;
    map[p.position].description = placeData.descriptions[p.position]; // ternary
  }
  return map;
};