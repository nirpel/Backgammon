const connectionEvents = require('../events/connection.event');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Chat = db.chat;


module.exports = (io, socket, users) => {
    socket.on('users-list', () => {
        connectionEvents.userConnected(io, users);
    })

    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.username), 1);
        connectionEvents.userDisconnected(io, users);
    });
}