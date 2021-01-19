// models/EntryV2.js

const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastUpdatedAt: Date,
    title: String,
    feelingScore: Number,
    note: String,
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
