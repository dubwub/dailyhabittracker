// models/Retrospective.js

const mongoose = require('mongoose');

const RetroSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    goal: {type: mongoose.Schema.Types.ObjectId}, // optional
    startDate: Date,
    endDate: Date,
    title: String,
    value: Number,
    note: String
});

module.exports = Retrospective = mongoose.model('retrospective', RetroSchema);
