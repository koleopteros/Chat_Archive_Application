const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    id: Number,
    type: String,
    date: String,
    time: String,
    user: String
})

module.exports = mongoose.model('socket_events', eventsSchema);
