var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Text, required: true, intial: true, index: true },
	email: { type: Types.Email, required: true, initial:true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	description: { type: Types.Text, initial: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, description, isAdmin';
User.register();
