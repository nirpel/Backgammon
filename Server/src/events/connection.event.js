const userConnected = (socket, users) => {
    let usernames = users.map(user => user.username);
    socket.emit("user-connected", usernames);
}

const userDisconnected = (socket, users) => {
    let usernames = users.map(user => user.username);
    socket.emit("user-disconnected", usernames);
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