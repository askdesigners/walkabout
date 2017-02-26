/**
 * 
 * 
 * @class Game 
 *
 *  This is the main game wrapper object. All main game actions are in here.
 */
class Game {

    /**
     * 
     * Creates an instance of Game.
     * 
     * @param {object} map The world map
     * @param {object} currentPosition Current position in the world
     * @param {object} playerName The player's name // TODO this should be an instance of Actor
     * @param {object} actors Other players on the map. Instances of Actor. // TODO rethink
     * @param {object} things Things that the player can interact with. Instances of Thing
     * @param {object} themes Color themes for map
     * 
     * @memberOf Game
     */
    constructor({map, currentPosition, playerName, actors, things, themes}) {
        var self = this;
        this.turn = 0;
        this.map = map;
        this.currentPosition = currentPosition;
        this.playerName = playerName;
        this.actors = actors;
        this.things = things;
        // this.setupParsing();
        this.moveHistory = ['a1'];
        this.commandHistory = [];
        this.themes = themes;
    }
    
    /**
     * 
     * Passes the constructed Game to the command parser, and command validators.
     * 
     * @memberOf Game
     */
    setupParsing(){
        commands(this);
        validators(this);
    }

    /**
     * 
     * Takes input text, and pushes to command history.
     * 
     * @param {string} text The input text to parse.
     * 
     * @memberOf Game
     */
    parseText(text){
        parser.parse(text);
        this.commandHistory.push(text);
    }
    
    /**
     * 
     * Moves the player on the map.
     * 
     * @param {string} dir Direction to walk - {n,s,e,w}
     * 
     * @memberOf Game
     */
    moveTo(dir){
        let next = this.map[this.currentPosition].getNeighbor(dir);
        let result = this._handleMove(this.currentPosition, next);
        this.responseHandler(result);
    }
    
    /**
     * 
     * Moves the player back to the previous place.
     * 
     * @memberOf Game
     */
    moveBack(){
        let next = this.moveHistory[this.moveHistory.length - 2];
        let result = this._handleMove(this.currentPosition, next);
        this.responseHandler(result);
    }
    
    /**
     * 
     * Has the user pick up an object and describe it. Updates things map.
     * 
     * @param {string} thing Slug name of thing to pick up.
     * 
     * @memberOf Game
     */
    pickupThing(thing){
        var result = {};
        if(this.things.collection[thing].heldBy === null){
            if(this._thingIsNearby(thing)){
                if(this.things.collection[thing].canHold != false){
                    result = this.things.collection[thing].onPickUp();
                    if(result.success === true){
                        console.log('taking: ', thing, 'from', this.currentPosition);
                        // flag thing obj as held
                        this.things.collection[thing].heldBy = 'player';
                        // add thing to game (or sync with mobx?)
                        this.things.map[this.currentPosition] = removeFromArray(this.things.map[this.currentPosition], thing);
                    }
                } else {
                    result.success = false;
                    result.message = 'You can\'t take that.';
                }
            } else {
                result.success = false;
                result.message = "There is no " + thing + " here.";
            }
        } else if(this._isHeldByplayer(thing)){
            result.success = false;
            result.message = "You are already holding that.";
        } else {
            result.success = false;
            result.message = "Someone is already holding that";
        }
        
        result.valid = true;

        this.responseHandler(result);
    }
    
    /**
     * 
     * Has the player put down the object, adding it back to the map.
     * 
     * @param {string} thing Slug name of object.
     * 
     * @memberOf Game
     */
    putDownThing(thing){
        var result = {};
        if(this._isHeldByplayer(thing)){
            this.things.collection[thing].onDrop();
            this.things.collection[thing].heldBy = null;
            this.things.collection[thing].position = this.currentPosition;
            result.success = true;
            result.message = "You put down the " + thing;
            if(this.things.map[this.currentPosition] === undefined){
                this.things.map[this.currentPosition] = [];
                this.things.map[this.currentPosition].push(thing);
            } else {
                this.things.map[this.currentPosition].push(thing);
            }
        } else {
            result.success = false;
            result.message = "You\'re not holding that.";
        }
        
        result.valid = true;
        this.responseHandler(result);
    }
    
    /**
     * 
     * Is called when no command is matched.
     * 
     * @param {any} result Result of command rejection
     * 
     * @memberOf Game
     */
    noCommandFound(result){
        this.responseHandler({success: false, valid: false, message: "I don't follow you..."});
    }
    
    /**
     * 
     * Adds a handler function which is called when the game responds to the user. Adds text into the main text area etc.
     * 
     * @param {function} fn 
     * 
     * @memberOf Game
     */
    addResponseHandler(fn){
        this.responseHandler = fn;
        fn({success: true, message:this.map[this.currentPosition].description});
    }
    
    /**
     * 
     * Adds a handler function for updating the color theme of main area.
     * 
     * @param {any} fn
     * 
     * @memberOf Game
     */
    addThemeHandler(fn){
        this.themeHandler = fn;
        fn(this.themes[this.map[this.currentPosition].colorTheme]);
    }
    
    /**
     * 
     * Has player look at some object and describe it.
     * 
     * @param {string} thing Thing to look at
     * 
     * @memberOf Game
     */
    lookAt(thing){
        var result = {};
        if(this._thingIsNearby(thing)){
            result.success = true;
            result.message = this.things.collection[thing].inspect();
        } else {
            result.success = false;
            result.message = "There is no " + thing + " here.";
        }
        this.responseHandler(result);
    }
    
    /**
     * 
     * Describes the immediate surroundings. 
     * 
     * @memberOf Game
     */
    lookAround(){
        var result = {};
        result.message = this.map[this.currentPosition].describe();
        
        var thingsHere = this.things.map[this.currentPosition];
        if(thingsHere !== undefined){
            var str = "<br/> In this room there's " + listize(thingsHere) + '.';
            result.message += str;
        } else {
            result.message = "There's nothing here to see really...";
        }
        result.success = true;
        this.responseHandler(result);
    }
    
    /**
     * 
     * Opens an openable object.
     * 
     * @memberOf Game
     */
    openThing(){}
    
    /**
     * 
     * Activates and object which can be activated.
     * 
     * @memberOf Game
     */
    activateThing(){}

    /**
     * 
     * Saves the current game.
     * 
     * @memberOf Game
     */
    save(){

    }
    
    /**
     * 
     * Determines if an object is in the same square as the player
     * 
     * @param {any} thing
     * @returns {boolean} 
     * 
     * @memberOf Game
     */
    _thingIsNearby(thing){
        return this.things.collection[thing].position === this.currentPosition;
    }
    
    /**
     * 
     * Determines whether an object is held by the player.
     * 
     * @param {any} thing
     * @returns
     * 
     * @memberOf Game
     */
    _isHeldByplayer(thing){
        return this.things.collection[thing].heldBy === 'player';
    }
    
    /**
     * 
     * Does the actual moving. Calls .onEnter() of the square moved into.
     * 
     * @param {any} curPos
     * @param {any} nextPos
     * @returns
     * 
     * @memberOf Game
     */
    _handleMove(curPos, nextPos){
        var result = {};
        if(nextPos != false){
            result = this.map[nextPos].onEnter();
            if(result.success === true){
                console.log('moving to ' + nextPos + ' from', curPos);
                this.map[curPos].onLeave();
                this.currentPosition = nextPos;
                this.moveHistory.push(this.currentPosition);
                this.themeHandler(this.themes[this.map[this.currentPosition].colorTheme]);
            } 
        } else {
            result.success = false;
            result.message = 'That way is blocked';
        }
        result.valid = true;
        return result;
    }

}

module.exports = Game;