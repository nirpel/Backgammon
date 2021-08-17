const { authJWT } = require('../middlewares');
const chatController = require('../controllers/chat.controller');

module.exports = (app) => {
    app.get(process.env.GET_CHAT_URL, [authJWT.verifyToken], chatController.getChat);
    app.get(process.env.GET_USERNAMES_URL, chatController.getUsernames);
};