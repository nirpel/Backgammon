module.exports = (io, msg) => {
    io.emit('message-recived', `server recived: ${msg}`);
}