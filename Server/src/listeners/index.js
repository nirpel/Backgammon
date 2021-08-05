const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const connectionListener = require('./connection.listener');
const chatListener = require('./chat.listener');
const connectionEvents = require('../events/connection.event');
const db = require('../data-access/models');
const User = db.user;
const Chat = db.chat;

const users = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            // when user connected - push it to connected users list & emit 'user-connected'
            console.log('socket id before verification:', socket.id);
            jwt.verify(socket.handshake.query.token, authConfig.secret, (err, decoded) => {
                if (err) throw err;
                socket.username = decoded.username;
                users.push({ id: socket.id, username: socket.username });
                connectionEvents.userConnected(io, users);
            });
            // join user to all the chats he belongs to
            //Chat.find({}).then((chats) => {
            //    for (let i = 0; i < chats.length; i++) {
            //        if (chats[i].participants.includes(socket.userId)) {
            //            console.log(`${socket.username} joined chat:`, chats[i]._id);
            //            socket.join(chats[i]._id);
            //        }
            //    }
            //});
        }
        connectionListener(io, socket, users);
        chatListener(io, socket, users);
    });

}