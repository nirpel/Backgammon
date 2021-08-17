const connectionEvents = require('../events/connection.event');

module.exports = (io, socket, users) => {
    socket.on('users-list', () => {
        connectionEvents.userConnected(io, users);
    })

    socket.on('disconnect', () => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users.splice(i, 1);
                break;
            }
        }
        connectionEvents.userDisconnected(io, users);
    });
}