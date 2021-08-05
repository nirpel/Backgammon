const mongoose = require('mongoose');

const ChatMessage = mongoose.model(
    'ChatMessage', new mongoose.Schema({
        message: String,
        date: { type: Date, default: Date.now },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    })
);

module.exports = ChatMessage;