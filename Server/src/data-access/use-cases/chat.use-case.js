const db = require('../models');
const Chat = db.chat;

const getChatByUsers = async (user1, user2) => {
    if (user1 && user2) {
        let chat = await Chat.findOne({
            $or: [
                { participants: [user1, user2] },
                { participants: [user2, user1] }
            ]
        })
        return chat;
    } else {
        return null;
    }
}

const chatUseCases = {
    getChatByUsers
};
module.exports = chatUseCases;