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
    categories: [{
        title: {
            type: String,
            required: true
        },
        icon: String,
        order: Number,
        color: String
    }],
	habits: [{
		title: {
			type: String,
			required: true
		},
		order: Number,
		entry_type: String,
        description: String,
        color: String, // does the color just get inherited from a category?
        thresholds: [
            {
                icon: String,
                color: String,
                minValue: Number,
                maxValue: Number
            }
        ]
    }]
});

module.exports = User = mongoose.model('user', UserSchema);
