import Thing from './Thing';

export const buildThings = function (things) {
    let collection = {};
    
    // square : thingName
    let map = {}; 
    
    for (var t of things) {
        let nT = new Thing(t);
        collection[nT.name] = nT;
        if(map[t.position] === undefined) map[t.position] = [];
        map[t.position].push(nT.name);
    }
    return { map, collection };
};