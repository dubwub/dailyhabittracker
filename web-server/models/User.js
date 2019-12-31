// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	habits: [{
		name: {
			type: String,
			required: true
		},
		order: Number,
		entry_type: String,
	}]
});

module.exports = User = mongoose.model('user', UserSchema);
