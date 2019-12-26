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
	journal_entries: [{
		date: Date,
		rating: Number,
		entry: String
	}],
	habits: [{
		name: {
			type: String,
			required: true
		},
		order: Number,
		entry_type: String,
		entries: [{
			date: Date,
			rating: String,
			entry: String
		}]
	}]
});

module.exports = User = mongoose.model('user', UserSchema);
