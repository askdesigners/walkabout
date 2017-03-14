// import camelize from '../utils/camelize';

var keystone = require('keystone'),
    ThingResource = keystone.list('Thing').model;


class Thing {

    constructor({name, canHold, heldBy = null, canUse, description, position, situation = 'on', canOpen = false, isLocked = false, useCount = 0, useLimit = 0, consumable = false, hasRequirement = false, requirement}) {
        let self = this;
        console.log('Loading:', name);
        this.name = name;
        this.slug = name;

        ThingResource
            .findOne({slug: this.slug})
            .exec()
            .then(function (item) { 
                if(item !== null){
                    self.heldBy = item.heldBy;
                    self.x = item.x;
                    self.y = item.y;
                    self.situation = item.situation;
                    self.isLocked = item.isLocked;
                    self.useCount = item.useCount;
                    self.RECORD = item;
                } else {
                    self.heldBy = heldBy;
                    self.x = position[0];
                    self.y = position[1];
                    self.situation = situation;
                    self.isLocked = isLocked;
                    self.useCount = useCount;
                    self._instantiate();
                }
            }, function (err) {
                throw new Error(err);
            });

            this.useLimit = useLimit;
            this.canUse = canUse;
            this.canHold = canHold;
            this.description = description; 
            this.canOpen = canOpen;
            this.consumable = consumable;
            this.hasRequirement = hasRequirement;
            this.requirement = hasRequirement ? requirement : null;

    }

    use(quantity = 1) {
        this.RECORD.incrementUseCount(quantity, (res)=>{
            console.log(res);
            this.sync();
        });
    }

    onDrop(position, done){
        var response = {};
        this.RECORD.drop(position, (err, res)=>{
            if(err){
                    console.error('error dropping thing', err);
                    response.message = `You couldn't drop the object.`;
                    response.success = false;
                    return done(response);
                } else {
                    this.heldBy = null;
                    response.success = true;
                    return done(response);
                }
            this.sync();
        });
    }
    
    onPickUp(user, done){
        var response = {};
        if(this.canPickUp()){
            this.RECORD.pickUp(user, (err, record)=>{
                if(err){
                    console.error('error picking up thing', err);
                    response.message = `You couldn't pick up the object.`;
                    response.success = false;
                    return done(response);
                } else {
                    this.heldBy = user._id;
                    response.message = this.inspect();
                    response.success = true;
                    this.sync();
                    return done(response);
                }
            })
        } else {
            response.message = "You can't pick that up.";
            response.success = false;
            return done(response);
        }
    }
    
    canPickUp(){
        // if(this.hasRequirement){} and requirent is met
        return true;
    }

    inspect(){
        return this.description;
    }

    unlock(){
        if(this.requirement && this.hasRequirement){
            this.RECORD.unlock((res)=>{
                this.sync();
            })
        }
    }

    whoHolds(){
        return this.RECORD.heldBy;
    }

    getMapKey(){
        return `${this.x}-${this.y}`;
    }

    sync(){
        this.name = this.RECORD.name;
        this.slug = this.RECORD.slug;
        this.id = this.RECORD.id;
        this.heldBy = this.RECORD.heldBy;
        this.description = this.RECORD.description;
        this.x = this.RECORD.x;
        this.y = this.RECORD.y;
        this.situation = this.RECORD.situation;
        this.isLocked = this.RECORD.isLocked;
        this.useCount = this.RECORD.useCount;
    }

    _instantiate(){
        
        console.log('Instantiating: ', this.name);
        
        let self = this;
        
        this.RECORD = new ThingResource({
            name: self.name,
            slug: self.slug,
            id: self.id,
            heldBy: self.heldBy,
            description: self.description,
            x: self.x,
            y: self.y,
            situation: self.situation,
            isLocked: self.isLocked,
            useCount: self.useCount
        });

        this.RECORD.save((res)=>{
            console.log('created:', self.name);
            return res;
        });
    }
}

module.exports = Thing;