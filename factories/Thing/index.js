let Thing = require('./Thing');

module.exports.buildThings = function (things) {
    let collection = {};
    
    // square : thingName
    let map = {}; 
    
    for (var t of things) {
        let nT = new Thing(t);
        collection[nT.name] = nT;
    }
    return { collection };
};