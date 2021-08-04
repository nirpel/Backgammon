const { reciveMessage } = require('../events/chat.events');

module.exports = (io, socket) => {
    socket.on('message-sent', (data) => {
        reciveMessage(io, socket, data);
        // TODO:
        // save message to server
    });
}