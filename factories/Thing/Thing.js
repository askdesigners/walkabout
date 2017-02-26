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
                    this.heldBy = item.heldBy;
                    this.lat = item.lat;
                    this.long = item.long;
                    this.situation = item.situation;
                    this.isLocked = item.isLocked;
                    this.useCount = item.useCount;
                } else {
                    self.heldBy = heldBy;
                    self.lat = position[0];
                    self.long = position[1];
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
        this.useCount = this.useCount + quantity;
        this.RECORD.incrementUseCount(quantity, (res)=>{
            console.log(res);
        });
    }

    onDrop(){
        this.RECORD.drop(position, (res)=>{
            console.log(res);
        });
    }
    
    onPickUp(){
        var response = {};
        if(this.canPickUp()){
            response.message = this.inspect();
            response.success = true;
        } else {
            response.message = "You can't pick that up.";
            response.success = false;
        }
        return response;
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
                console.log(res);
            })
        }
    }

    whoHolds(){
        // this.RECORD.
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
            lat: self.lat,
            long: self.long,
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