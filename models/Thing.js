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
	x: {type: Types.Number, initial: true, index: true }, 
	y: {type: Types.Number, initial: true, index: true }, 
	situation: {type: Types.Text, initial: true },
	isLocked: {type: Types.Boolean, initial: true },
	useCount: {type: Types.Number, initial: true },
});

Thing.schema.methods.pickUp = function(user, next) {
	console.log(user);
	if(user._id) this.heldBy = user._id;
	else this.heldBy = user;
	return this.save(next);
};

Thing.schema.methods.drop = function(position, next) {
	this.heldBy = null;
	this.x = position[0];
	this.y = position[1];
	return this.save(next);
};

Thing.schema.methods.incrementUseCount = function(quantity, next) {
	this.useCount = this.useCount + quantity;
	return this.save(next);
};

Thing.schema.methods.unlock = function(next) {
	this.isLocked = false;
	return this.save(next);
};

Thing.schema.statics.findAt = function(position, next) {
	return this.find({x: position[0], y: position[1]}, next);
};

/**
 * Registration
 */
Thing.defaultColumns = 'name, id, x, y, useCount';

Thing.register();

