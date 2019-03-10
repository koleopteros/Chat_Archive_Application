const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    id: Number,
    type: String,
    timestamp: Number,
    user: String,
    val: String,
})

module.exports = mongoose.model('socket_events', eventsSchema);
