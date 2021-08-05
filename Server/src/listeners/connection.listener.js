const connectionEvents = require('../events/connection.event');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../data-access/models');
const User = db.user;
const Chat = db.chat;


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