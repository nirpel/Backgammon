const jwt = require('jsonwebtoken');
const connectionListener = require('./connection.listener');
const chatListener = require('./chat.listener');
const authConfig = require('../config/auth.config');

module.exports = (io) => {
    connectionListener(io);
    chatListener(io);
}