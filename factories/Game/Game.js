let commands = require('../Parsing/commands'),
    validators = require('../Parsing/validators'),
    parser = require('../Parsing/parser');

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
        this.setupParsing();
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
    parseText({user, text}){
        parser.parse({user, input:text});
        // mongo db make cmd history
        // this.commandHistory.push(text);
    }

    setNewPlayerName({user, name}){
        // check name unique
        // add name to session
        // prompt for PW
    }

    setNewPlayerPass({user, password}){
        // check for username in session
        // check for valid PW
        // create user record in DB
        // replace session with proper logged in session
        // prompt for desc
    }

    setNewPlayerDesc({user, desc}){
        // check for user session
    }
    
    /**
     * 
     * Moves the player on the map.
     * 
     * @param {string} dir Direction to walk - {n,s,e,w}
     * 
     * @memberOf Game
     */
    moveTo({user, dir}){
        let curPosKey = this._makeMapKey(user);
        let next = this.map[curPosKey].getNeighbor(dir);
        let result = this._handleMove(curPosKey, next);
        
        if(result.success){
            let latlong = next.split('-');
            user.x = parseInt(latlong[0],10);
            user.y = parseInt(latlong[1],10);
            user.save(()=>{
                this.responseHandler({user, message: result.message});
            })
        } else {
            this.responseHandler({user, message: result.message});
        }
    }
    
    /**
     * 
     * Moves the player back to the previous place.
     * 
     * @memberOf Game
     */
    moveBack({user}){
        let next = this.moveHistory[this.moveHistory.length - 2];
        let result = this._handleMove(this.currentPosition, next);
        this.responseHandler({user, message: result.message});
    }
    
    /**
     * 
     * Has the user pick up an object and describe it. Updates things map.
     * 
     * @param {string} thing Slug name of thing to pick up.
     * 
     * @memberOf Game
     */
    pickupThing({user, thing}){
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

        this.responseHandler({user, message: result.message});
    }
    
    /**
     * 
     * Has the player put down the object, adding it back to the map.
     * 
     * @param {string} thing Slug name of object.
     * 
     * @memberOf Game
     */
    putDownThing({user, thing}){
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
        this.responseHandler({user, message: result.message});
    }
    
    /**
     * 
     * Is called when no command is matched.
     * 
     * @param {any} result Result of command rejection
     * 
     * @memberOf Game
     */
    noCommandFound({user, result}){
        this.responseHandler({success: false, valid: false, user, message: "I don't follow you..."});
    }
    
    /**
     * 
     * Adds a handler function which is called when the game responds to the user. Hooks into socket output.
     * 
     * @param {function} fn 
     * 
     * @memberOf Game
     */
    addResponseHandler(fn){
        this.responseHandler = fn;
    }
    
    /**
     * 
     * Adds a handler function for updating the color theme of main area. Hooks into socket output.
     * 
     * @param {any} fn
     * 
     * @memberOf Game
     */
    addThemeHandler(fn){
        this.themeHandler = fn;
    }
    
    /**
     * 
     * Has player look at some object and describe it.
     * 
     * @param {string} thing Thing to look at
     * 
     * @memberOf Game
     */
    lookAt({user, thing}){
        var result = {};
        if(this._thingIsNearby(thing)){
            result.success = true;
            result.message = this.things.collection[thing].inspect();
        } else {
            result.success = false;
            result.message = "There is no " + thing + " here.";
        }
        this.responseHandler({user, message: result.message});
    }
    
    /**
     * 
     * Describes the immediate surroundings. 
     * 
     * @memberOf Game
     */
    lookAround({user}){
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
        this.responseHandler({user, message: result.message});
    }
    
    /**
     * 
     * Opens an openable object.
     * 
     * @memberOf Game
     */
    openThing({user, thing}){}
    
    /**
     * 
     * Activates and object which can be activated.
     * 
     * @memberOf Game
     */
    activateThing({user, thing}){}

    
    /**
     * 
     * Determines if an object is in the same square as the player
     * 
     * @param {any} thing
     * @returns {boolean} 
     * 
     * @memberOf Game
     */
    _thingIsNearby({user, thing}){
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
    _isHeldByplayer({user, thing}){
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
        if(nextPos !== false){
            result = this.map[nextPos].onEnter();
            if(result.success === true){
                console.log('moving from ' + curPos + ' to ' + nextPos);
                this.map[curPos].onLeave();
                // this.themeHandler(this.themes[this.map[this.currentPosition].colorTheme]);
            } else {
                console.log('moving from ' + curPos + ' to ' + nextPos);
                result.success = false;
                result.message = 'That way is blocked';
            }
        } else {
            result.success = false;
            result.message = 'That way is blocked';
        }
        result.valid = true;
        return result;
    }

    _makeMapKey(user){
        return user.x + '-' + user.y;
    }

}

module.exports = Game;