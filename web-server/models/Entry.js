// models/Entry.js

const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    habit: {type: mongoose.Schema.Types.ObjectId}, // null for daily entries
    date: Date, // attempt to truncate time out of date
    value: Number, // for prototype, add attachments of some sort
    note: String, // journal entry 
    transactions: [{
        time: Date,
        value: Number,
        note: String,
    }],
    // tags: [{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = Entry = mongoose.model('entry', EntrySchema);
