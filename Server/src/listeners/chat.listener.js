const { reciveMessage } = require('../events/chat.events');

module.exports = (io) => {
    socket.on('subscribe', (chatId) => {
        socket.join(chatId);
    });

    socket.on('send message', (data) => {
        reciveMessage(socket, data);
        // TODO:
        // save message to server
    })
}