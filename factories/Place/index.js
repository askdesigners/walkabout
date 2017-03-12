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
  const x = p.x;
  const y = p.y;
  let dirs = {};
  
  if(blockedTo.indexOf('s') !=-1  || y >= dimensions[1]){
    dirs.toS = false;
  } else {
    dirs.toS = [x, y + 1];
  }
  
  if(blockedTo.indexOf('n') !=-1  || y == 1){
    dirs.toN = false;
  } else {
    dirs.toN = [x, y - 1];
  }
  
  if(blockedTo.indexOf('e') !=-1 || x >= dimensions[0]){
    dirs.toE = false;
  } else {
    dirs.toE = [x + 1, y]
  }
  
  if(blockedTo.indexOf('w') !=-1  || x == 1){
    dirs.toW = false;
  } else {
    dirs.toW = [x - 1, y]
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
  let count = 0;
  console.log('Building places...');
  for(var p of placeData.definitions){
    let key = p.x + '-' + p.y;
    let {toN,toE,toS,toW} = deriveNeighbors(p, placeData.dimensions);
    map[key] = new Place(p);
    map[key].toN = toN;
    map[key].toE = toE;
    map[key].toS = toS;
    map[key].toW = toW;
    map[key].description = placeData.descriptions[key];
    count++;
  }
  console.log('Places: ', count);
  return map;
};