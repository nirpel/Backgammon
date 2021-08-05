const mongoose = require('mongoose');

const Chat = mongoose.model(
    "Chat", new mongoose.Schema({
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage"}]
    })
);

module.exports = Chat;