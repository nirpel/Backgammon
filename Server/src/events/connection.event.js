const userConnected = (socket, users) => {
    socket.emit("user-connected", users);
}

const userDisconnected = (socket, users) => {
    socket.emit("user-disconnected", users);
}

const messageRecived = (socket, msg) => {
    socket.emit('message-recived', `server recived: ${msg}`);
}

const connectionEvents = {
    userConnected,
    messageRecived,
    userDisconnected
};

module.exports = connectionEvents;