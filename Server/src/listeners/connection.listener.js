const connectionEvents = require('../events/connection.event');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');

const users = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, authConfig.secret, (err, decoded) => {
                if (err) throw err;
                socket.username = decoded.username;
                users.push(socket.username);
                connectionEvents.userConnected(io, users);
            });
        }

        socket.on('users-list', () => {
            connectionEvents.userConnected(io, users);
        })

        socket.on('disconnect', () => {
            users.splice(users.indexOf(socket.username), 1);
            connectionEvents.userDisconnected(io, users);
        });

        socket.on('message-sent', (msg) => {
            connectionEvents.messageRecived(socket, msg);
        });
    })
}