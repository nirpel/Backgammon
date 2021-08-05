const User = require('../data-access/models').user;

reciveMessage = (io, socket, data) => {
    io.to(data.to).emit('message-recived', data.message);
}

module.exports = {
    reciveMessage
};