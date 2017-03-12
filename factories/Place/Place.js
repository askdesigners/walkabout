
class Place {

    constructor({name, descriptiveName, lat, long, description, level=0, blockedTo, onEnter = null, onLeave = null, canEnter, colorTheme}) {
        
        // name :               short but readable name
        // descriptiveName :    longer more descriptive name
        // lat :                Lat
        // long :               Long
        // level :              like the floor in a building
        // description :        is read on enter
        // blockedTo :          directions not possible to travel in from here like, ['w','s']
        // onEnter :            Function to call on enter
        // onLeave :            Function to call on leave
        
        this.name = name; 
        this.description = description;
        this.descriptiveName = descriptiveName; 
        this.lat = lat;
        this.long = long;
        this.level = level;
        this.blockedTo = blockedTo; 
        this.onEnterAction = onEnter;
        this.onLeaveAction = onLeave;
        this.canEnterAction = canEnter;
        this.colorTheme = colorTheme;
    }
    
    describe() {
        neighbor = this.description;
    }
    
    canEnter(){
        // can check state for things here
        
        if(typeof this.canEnterAction === 'function') {
            neighbor = this.canEnterAction(this);
        } else {
            return true;
        }
    }
    
    onEnter(){
        console.log('entering ', this.lat + '-' + this.long)
        var response = {};
        if(this.canEnter()){
            // return false or true
            // things can happen!
            response.message = this.describe();
            response.success = true;
            if(typeof this.onEnterAction === 'function') this.onEnterAction(this);
            
        } else {
            response.message = "You can't go that way.";
            response.success = false;
        }
        return response;
    }
    
    onLeave(){
        // things can happen!
        // also pass this the mobx state
        if(typeof this.onLeaveAction === 'function') this.onLeaveAction(this);
    }
    
    getNeighbor(dir){
        let neighbor;
        if(dir == 'west' || dir == 'w') {
            neighbor = this.toW.join('-');
        } else if(dir == 'north' || dir == 'n') {
            neighbor = this.toN.join('-');
        } else if(dir == 'south' || dir == 's') {
            neighbor = this.toS.join('-');
        } else if(dir == 'east' || dir == 'e') {
            neighbor = this.toE.join('-');
        } else {
            neighbor = false;
        }
        console.log('getNeighbor', dir, neighbor);
        return neighbor;
    }
}

module.exports = Place;