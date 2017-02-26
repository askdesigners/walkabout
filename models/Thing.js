var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Thing Model
 * ==========
 */
var Thing = new keystone.List('Thing');

Thing.add({
	name: { type: Types.Text, required: true },
	slug: { type: Types.Text, initial: true, required: true, index: true },
	heldBy: {type: Types.Relationship, ref: 'User', initial: true, index: true },
	description: {type: Types.Textarea, initial: true },
	lat: {type: Types.Number, initial: true, index: true }, 
	long: {type: Types.Number, initial: true, index: true }, 
	situation: {type: Types.Text, initial: true },
	isLocked: {type: Types.Boolean, initial: true },
	useCount: {type: Types.Number, initial: true },
});

Thing.schema.methods.pickUp = (user, next) => {
	if(user._id) this.heldBy = user._id;
	else this.heldBy = user;
	return this.save(next);
};

Thing.schema.methods.drop = (position, next) => {
	this.heldBy = null;
	this.lat = position[0];
	this.long = position[1];
	return this.save(next);
};

Thing.schema.methods.incrementUseCount = (quantity, next) => {
	this.useCount = this.useCount + quantity;
	return this.save(next);
};

Thing.schema.methods.unlock = (next) => {
	this.isLocked = false;
	return this.save(next);
};

Thing.schema.statics.findAt = (position, next) => {
	return this.find({lat: position[0], long: position[1]}, next);
};

/**
 * Registration
 */
Thing.defaultColumns = 'name, id, lat, long, useCount';

Thing.register();

