const db = require('../models');
const ChatMessage = db.chatMessage;
const Chat = db.chat;


const createChatMessage = (chatId, message) => {
    return ChatMessage.create(message).then(async (docMessage) => {
        return Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: docMessage._id } },
            { new: true, useFindAndModify: false }
        );
    });
};

const chatMessageUseCases = {
    createChatMessage
};
module.exports = chatMessageUseCases;