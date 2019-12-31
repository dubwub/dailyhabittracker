// models/Entry.js

const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    habit: {type: mongoose.Schema.Types.ObjectId}, // null for daily entries
    date: Date, // attempt to truncate time out of date
    entry: String, // for prototype, true/false
    note: String // journal entry 
});

module.exports = Entry = mongoose.model('entry', EntrySchema);
