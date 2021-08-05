const db = require('../data-access/models');
const User = db.user;
const Chat = db.chat;
const ChatMessage = db.chatMessage;

// Get chat by two users. if chat is not found, create a new one.
getChat = async (req, res) => {
    // available with using middlewate veirfyToken (authJWT)
    let user1 = await User.findOne({ _id: req.userId });     // request sender
    let user2 = await User.findOne({ username: req.query.chatUser });  // chat friend (username)
    if (!user2) {
        return res.status(403).send({ message: 'User not exist'});
    }
    let requiredChat = await Chat.findOne({
        $or: [
            { participants: [user1, user2] },
            { participants: [user2, user1] }
        ]
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
            // return new empty chat
            return res.status(200).send({ id: chat._id, messages: null });
        })
    } else {
        // If chat found, return id & messages collection
        let messages = [];
        for (let i = 0; i < requiredChat.messages.length; i++) {
            let message = await ChatMessage.findById(requiredChat.messages[i]._id || requiredChat.messages[i]);
            let sender = await User.findById(message.sender._id || message.sender);
            messages.push({
                message: message.message,
                date: message.date,
                sender: sender.username
            });
        }
        return res.status(200).send({ id: requiredChat._id, messages: messages });
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
