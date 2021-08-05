const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const ioListener = require('./listeners');

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


const db = require("./data-access/models");
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

//const createMessageTest = async () => {
//    const ChatMessage = db.chatMessage;
//    const User = db.user;
//    const Chat = db.chat;
//    let nirpel = await User.findOne({ username: 'nirpel' });
//    let testo123 = await User.findOne({ username: 'testo123' });
//    let chat = await Chat.findOne({ participants: [nirpel, testo123] || [testo123, nirpel] });
//    let message1 = new ChatMessage({
//        message: 'Hi there!',
//        date: Date.now(),
//        sender: nirpel
//    });
//    let message2 = new ChatMessage({
//        message: 'Hello Man :-)',
//        date: Date.now(),
//        sender: testo123
//    });
//    db.chatMessage.create([message1, message2]).then(
//        (docMessage) => {
//            return db.chat.findByIdAndUpdate(
//                chat._id,
//                { $push: {messages: docMessage._id }},
//                {new: true, useFindAndModify: false}
//            );
//        }
//    );
//}


const PORT = process.env.PORT || 3420
server.listen(PORT, () => {
    console.log('listening on *:', PORT);
})

