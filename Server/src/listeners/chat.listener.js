const { reciveMessage } = require('../events/chat.events');

module.exports = (io) => {
    io.on('subscribe', (chatId) => {
        socket.join(chatId);
    });

    io.on('send message', (data) => {
        reciveMessage(socket, data);
        // TODO:
        // save message to server
    })
}