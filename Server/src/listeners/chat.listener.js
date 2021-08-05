const { reciveMessage } = require('../events/chat.events');
const db = require('../data-access/models');
const { getChatByUsers } = require('../data-access/use-cases/chat.use-case');
const { createChatMessage } = require('../data-access/use-cases/chat-message.use-case');
const User = db.user;
const ChatMessage = db.chatMessage;

module.exports = (io, socket, users) => {
    socket.on('message-sent', async (data) => {
        // get index of connected user to send the message to
        let indexOfUser;
        for (let i = 0; i < users.length; i++) {
            if (data.to === users[i].username) {
                indexOfUser = i;
                break;
            }
        }
        // set the 'to' prop to socketId of user to send to
        data.to = users[indexOfUser].id;
        // save message to db
        let sender = await User.findOne({ username: data.message.sender });
        let reciver = await User.findOne({ username: users[indexOfUser].username});
        let chat = await getChatByUsers(sender, reciver);
        chat = await createChatMessage(chat._id, {
            message: data.message.message,
            date: new Date(data.message.date),
            sender: sender
        });
        // emit event to user that message arrived
        reciveMessage(io, socket, data);
    });
}
