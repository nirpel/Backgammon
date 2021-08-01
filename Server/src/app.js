const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userTestRoutes = require('./routes/user.routes');

const app = express();
const server = http.createServer(app);
const corsOptions = {
    cors: {
        origins: ['*']
    }
}
const io = socketio(server, corsOptions);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
authRoutes(app);

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message-sent', (msg) => {
        io.emit('message-recived', `server recived: ${msg}`);
    })
});

const db = require("./models");
const dbConfig = require('./config/db.config');
const userRoutes = require('./routes/user.routes');

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

const PORT = process.env.PORT || 3420
server.listen(PORT, () => {
    console.log('listening on *:', PORT);
})

