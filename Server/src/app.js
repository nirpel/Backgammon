require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const ioListener = require('./listeners');
const db = require("./data-access/models");

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
chatRoutes(app);
ioListener(io);

db.mongoose
    .connect(process.env.MONGODB_URL, {
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

server.listen(process.env.PORT, () => {
    console.log('listening on *:', process.env.PORT);
});

