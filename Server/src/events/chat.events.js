reciveMessage = (io, data) => {
    io.broadcast.to(data.chatId).emit('recive message', {
        chatMessage: data.chatMessage
    });
}

module.exports = {
    reciveMessage
};