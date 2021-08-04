const User = require('../models').user;

reciveMessage = (io, socket, data) => {
    console.log('Trying to emit from server:', data)
    User.findOne({ username: data.to }).then((user) => {
        io.emit('message-recived', data.message); /*to(user._id)*/
    });
}

module.exports = {
    reciveMessage
};