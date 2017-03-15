let commands = require('../Parsing/commands'),
    validators = require('../Parsing/validators'),
    parser = require('../Parsing/parser'),
    listize = require('../Parsing/lib/listize');

var keystone = require('keystone'),
    ThingsResource = keystone.list('Thing').model;

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
    constructor({ map, things, themes }) {
        var self = this;
        this.map = map;
        this.things = things;
        this.setupParsing();
        this.themes = themes;
    }

    /**
     * 
     * Passes the constructed Game to the command parser, and command validators.
     * 
     * @memberOf Game
     */
    setupParsing() {
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
    parseText({ user, text }) {
        parser.parse({ user, input: text });
        // mongo db make cmd history
        // this.commandHistory.push(text);
    }

    setNewPlayerName({ user, name }) {
        // check name unique
        // add name to session
        // prompt for PW
    }

    setNewPlayerPass({ user, password }) {
        // check for username in session
        // check for valid PW
        // create user record in DB
        // replace session with proper logged in session
        // prompt for desc
    }

    setNewPlayerDesc({ user, desc }) {
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
    moveTo({ user, dir }) {
        let curPosKey = this._makeMapKey(user);
        let next = this.map[curPosKey].getNeighbor(dir);
        let result = this._handleMove(curPosKey, next);

        if (result.success) {
            let latlong = next.split('-');
            user.x = parseInt(latlong[0], 10);
            user.y = parseInt(latlong[1], 10);
            user.save(() => {
                this.responseHandler({ user, message: result.message });
            })
        } else {
            this.responseHandler({ user, message: result.message });
        }
    }

    /**
     * 
     * Moves the player back to the previous place.
     * 
     * @memberOf Game
     */
    moveBack({ user }) {
        let next = this.moveHistory[this.moveHistory.length - 2];
        let result = this._handleMove(_makeMapKey(user), next);
        this.responseHandler({ user, message: result.message });
    }

    /**
     * 
     * Describes the immediate surroundings. 
     * 
     * @memberOf Game
     */
    lookAround({ user }) {
        var result = {},
            self = this,
            here = this._makeMapKey(user).split('-').map(i => parseInt(i, 10));

        result.message = this.map[this._makeMapKey(user)].describe();

        ThingsResource.findAt(here, (err, thingsHere) => {
            if (err) {
                self.responseHandler({ user, message: err });
            }
            if (thingsHere.length > 0) {
                var str = "<br/> In this room there's " + listize(thingsHere) + '.';
                result.message += str;
            } else {
                result.message = "There's nothing here to see really...";
            }
            result.success = true;
            self.responseHandler({ user, message: result.message });
        });
    }

    /**
     * 
     * Has the user pick up an object and describe it. Updates things map.
     * 
     * @param {string} thing Slug name of thing to pick up.
     * 
     * @memberOf Game 
     */
    pickupThing({ user, thing }) {
        var result = {},
            here = this._makeMapKey(user).split('-').map(i => parseInt(i, 10));

        if (this.things.collection[thing].heldBy === null || this.things.collection[thing].heldBy === undefined) {
            if (this._thingIsNearby({ user, thing })) {
                if (this.things.collection[thing].canHold !== false) {

                    this.things.collection[thing].onPickUp(user, (res) => {
                        if (res.success === true) {
                            console.log('taking: ', thing, 'from', this._makeMapKey(user), res);
                        }
                        this.responseHandler({ user, message: res.message });
                    });
                } else {
                    result.success = false;
                    result.message = `You can't take that.`;
                }
            } else {
                result.success = false;
                result.message = `There is no ${thing} here.`;
            }
        } else if (this._isHeldByPlayer({ user, thing })) {
            result.success = false;
            result.message = `You are already holding that.`;
        } else {
            result.success = false;
            result.message = `Someone is already holding that.`;
        }

        this.responseHandler({ user, message: result.message });
    }

    /**
     * 
     * Has the player put down the object, adding it back to the map.
     * 
     * @param {string} thing Slug name of object.
     * 
     * @memberOf Game
     */
    putDownThing({ user, thing }) {
        var result = {},
            here = this._makeMapKey(user).split('-').map(i => parseInt(i, 10));

        if (this._isHeldByPlayer({ user, thing })) {
            this.things.collection[thing].onDrop(here, (res) => {
                if (res.success === true) {
                    console.log('dropping: ', thing, ' at ', this._makeMapKey(user), res);
                    this.things.collection[thing].heldBy = null;
                    this.things.collection[thing].x = res.x;
                    this.things.collection[thing].y = res.y;
                    result.message = `You put down the ${thing}`;
                } else {
                    result = res;
                }
                return this.responseHandler({ user, message: result.message });
            });
        } else {
            result.success = false;
            result.message = `You're not holding that.`;
        }

        return this.responseHandler({ user, message: result.message });
    }

    /**
     * 
     * Has player look at some object and describe it.
     * 
     * @param {string} thing Thing to look at
     * 
     * @memberOf Game
     */
    lookAt({ user, thing }) {
        var result = {},
            here = this._makeMapKey(user).split('-').map(i => parseInt(i, 10));

        if (this._thingIsNearby(thing)) {
            result.success = true;
            result.message = this.things.collection[thing].inspect();
        } else {
            result.success = false;
            result.message = "There is no " + thing + " here.";
        }
        this.responseHandler({ user, message: result.message });
    }
    
    /**
     * 
     * Shows things held by player
     * 
     * @param {string} thing Thing to look at
     * 
     * @memberOf Game
     */
    playerIsHolding({ user }) {
        var result = {};
        ThingsResource.find({heldBy: user._id}, (err, things)=>{
            console.log(err, things)
            if (err) {
                result.success = false;
                result.message = "There is no " + thing + " here.";
            } else if(things.length > 0){
                result.success = true;
                result.message = `You are holding ${listize(things)}.`;
            } else {
                result.success = true;
                result.message = `You aren't carrying anything right now.`;
            }
            this.responseHandler({ user, message: result.message });
        });
    }

    /**
     * 
     * Opens an openable object.
     * 
     * @memberOf Game
     */
    openThing({ user, thing }) { }

    /**
     * 
     * Activates and object which can be activated.
     * 
     * @memberOf Game
     */
    activateThing({ user, thing }) { }

    /**
     * 
     * Adds a handler function which is called when the game responds to the user. Hooks into socket output.
     * 
     * @param {function} fn 
     * 
     * @memberOf Game
     */
    addResponseHandler(fn) {
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
    addThemeHandler(fn) {
        this.themeHandler = fn;
    }

    /**
     * 
     * Is called when no command is matched.
     * 
     * @param {any} result Result of command rejection
     * 
     * @memberOf Game
     */
    noCommandFound({ user, result }) {
        this.responseHandler({ success: false, valid: false, user, message: "I don't follow you..." });
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
    _thingIsNearby({ user, thing }) {
        var here = this._makeMapKey(user).split('-').map(i => parseInt(i, 10));
        console.log(this.things.collection[thing], this.things.collection[thing].getMapKey(), this._makeMapKey(user));
        return this.things.collection[thing].getMapKey() === this._makeMapKey(user);
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
    _isHeldByPlayer({ user, thing }) {
        return this.things.collection[thing].heldBy + '' === user._id + '';
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
    _handleMove(curPos, nextPos) {
        var result = {};
        if (nextPos !== false) {
            result = this.map[nextPos].onEnter();
            if (result.success === true) {
                console.log('moving from ' + curPos + ' to ' + nextPos);
                this.map[curPos].onLeave();
                // this.themeHandler(this.themes[this.map[this._makeMapKey(user)].colorTheme]);
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

    _makeMapKey(user) {
        return user.x + '-' + user.y;
    }

}

module.exports = Game;