const mongoose = require('mongoose');

const chatHistorySchema = mongoose.Schema({
    id: Number,
    room: Number,
    timestamp: Number,
    sender: String,
    message: String
})

module.exports = mongoose.model('chat_history', chatHistorySchema);
