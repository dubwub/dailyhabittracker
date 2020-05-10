// models/Event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    startDate: Date,
    endDate: Date,
    title: String,
    color: String
});

module.exports = Event = mongoose.model('event', EventSchema);
