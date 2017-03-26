
class Place {

    constructor({ name, descriptiveName, y, x, description, level = 0, blockedTo, onEnter = null, onLeave = null, canEnter, colorTheme }) {

        // name :               short but readable name
        // descriptiveName :    longer more descriptive name
        // x :                  x position
        // y :                  y position
        // level :              like the floor in a building
        // description :        is read on enter
        // blockedTo :          directions not possible to travel in from here like, ['w','s']
        // onEnter :            Function to call on enter
        // onLeave :            Function to call on leave

        this.name = name;
        this.description = description;
        this.descriptiveName = descriptiveName;
        this.y = y;
        this.x = x;
        this.level = level;
        this.blockedTo = blockedTo;
        this.onEnterAction = onEnter;
        this.onLeaveAction = onLeave;
        this.canEnterAction = canEnter;
        this.colorTheme = colorTheme;
    }

    describe() {
        return this.description;
    }

    canEnter() {
        // can check state for things here
        if (typeof this.canEnterAction === 'function') {
            return this.canEnterAction(this);
        } else {
            return true;
        }
    }

    onEnter() {
        console.log('entering ', this.x + '-' + this.y)
        var response = {};
        if (this.canEnter()) {
            // things can happen!
            response.message = this.describe();
            response.success = true;
            if (typeof this.onEnterAction === 'function') this.onEnterAction(this);

        } else {
            response.message = "You can't go that way.";
            response.success = false;
        }
        return response;
    }

    onLeave() {
        // things can happen!
        if (typeof this.onLeaveAction === 'function') this.onLeaveAction(this);
    }

    getNeighbor(dir) {
        let neighbor;
        if (dir == 'west' || dir == 'w') {
            neighbor = this.toW;
        } else if (dir == 'north' || dir == 'n') {
            neighbor = this.toN;
        } else if (dir == 'south' || dir == 's') {
            console.log('this.toS', this.toS);
            neighbor = this.toS;
        } else if (dir == 'east' || dir == 'e') {
            neighbor = this.toE;
        }
        if(neighbor){
            return neighbor.join('-');
        }
        return false;
    }
}

module.exports = Place;