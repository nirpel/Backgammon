const jwt = require('jsonwebtoken');
const connectionListener = require('./connection.listener');
const chatListener = require('./chat.listener');
const backgammonListener = require('./backgammon.listener');
const connectionEvents = require('../events/connection.event');

const users = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            // when user connected - push it to connected users list & emit 'user-connected'
            jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, (err, decoded) => {
                if (err) throw err;
                socket.username = decoded.username;
                users.push({ id: socket.id, username: socket.username });
                connectionEvents.userConnected(io, users);
            });
        }
        connectionListener(io, socket, users);
        chatListener(io, socket, users);
        backgammonListener(io, socket, users);
    });
}