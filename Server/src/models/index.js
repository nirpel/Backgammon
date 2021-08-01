const mongoose = require('mongoose');
const User = require('./user.model');
const ChatMessage = require('./chat-message.model');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.chatMessage = ChatMessage;

module.exports = db;