const connectionEvent = require('../events/connection.event');

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log('user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    
        socket.on('message-sent', (msg) => {
            connectionEvent(socket, msg);
        })
    })
}