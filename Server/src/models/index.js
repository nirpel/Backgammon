const mongoose = require('mongoose');
const User = require('./user.model');
const Chat = require('./chat.model');
const ChatMessage = require('./chat-message.model');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.chat = Chat;
db.chatMessage = ChatMessage;

module.exports = db;