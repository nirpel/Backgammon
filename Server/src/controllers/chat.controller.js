const db = require('../models');
const User = db.user;
const Chat = db.chat;

// Get chat by two users. if chat is not found, create a new one.
getChat = async (req, res) => {
    // available with using middlewate veirfyToken (authJWT)
    let user1 = await User.findOne({ _id: req.userId });     // request sender
    let user2 = await User.findOne({ username: req.body.chatUser });  // chat friend (username)
    let requiredChat = await Chat.findOne({
        participants: [user1, user2] || [user2, user1]
    });
    if (!requiredChat) {
        // if chat not found, Create Chat and return it
        Chat.create(new Chat({
            participants: [user1, user2],
            messages: []
        })).then((chat, err) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            return res.status(200).send({ id: chat._id, messages: chat.messages });
        })
    } else {
        // If chat found, return id & messages collection
        return res.status(200).send({ id: requiredChat._id, messages: requiredChat.messages });
    }
}

getUsernames = async (req, res) => {
    let users = (await User.find()).map((user) => user.username);
    return res.status(200).send(JSON.stringify(users));
}

const chatController = {
    getChat,
    getUsernames
};
module.exports = chatController;
