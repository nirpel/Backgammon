const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const chatApi = require('./api/chatApi');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});
app.use(chatApi);

app.get('/', (req, res) => {
    res.send('Hey from server');
});

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message-sent', (msg) => {
        io.emit('message-recived', `server recived: ${msg}`);
    })
});

server.listen(3420, () => {
    console.log('listening on *:3420');
})