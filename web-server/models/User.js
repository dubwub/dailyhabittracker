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
    // deprecated
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
        category: {type: mongoose.Schema.Types.ObjectId},
        startDate: Date,
        endDate: Date,
        archived: Boolean,
		order: Number,
		entry_type: String,
        description: String,
        color: String, // does the color just get inherited from a category?
        thresholds: [
            {
                icon: String,
                color: String,
                condition: String, // lt (lessthan), le (lessthan or equal to), eq, ge, gt, between
                minValue: Number,
                maxValue: Number
            }
        ],
        tags: [
            {
                icon: String,
                color: String,
                title: String
            }
        ]
    }],
    // start v2
    dreams: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        color: String,
        order: Number,
    }],
    experiments: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        color: String,
        startDate: Date,
        endDate: Date,
        dream: {type: mongoose.Schema.Types.ObjectId},
        order: Number,
    }],
    netWorth: Number,
    // start v3
    tags: [{
        type: String,
        tag: String,
        parents: [{type: mongoose.Schema.Types.ObjectId}],
        neighbors: [{type: mongoose.Schema.Types.ObjectId}],
    }],
    selfMessage: String,
});

module.exports = User = mongoose.model('user', UserSchema);
