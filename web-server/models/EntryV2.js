// models/EntryV2.js

const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    // V3
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags: [{ tag: String, entryType: String }],
    transactions: [{
        time: Date,
        entryType: String,
        title: String,
        // feelingScore: Number,
        note: String,
    }],
    entryType: String,
    time: Date,
    title: String,
    note: String,

    // not V3
    feelingScore: Number,
    lastUpdatedAt: Date,
    experiments: [{type: mongoose.Schema.Types.ObjectId}],
    dreams: [{type: mongoose.Schema.Types.ObjectId}],
    observations: [String],
    highlights: [String],
    subnotes: [{
        dream: {type: mongoose.Schema.Types.ObjectId},
        experiment: {type: mongoose.Schema.Types.ObjectId},
        note: String
    }]

});

module.exports = Entry = mongoose.model('entryv2', EntrySchema);
