const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const connectionListener = require('./listeners/connection.listener');

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
connectionListener(io);


const db = require("./models");
const dbConfig = require('./config/db.config');

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

