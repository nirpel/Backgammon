const { authJWT } = require('../middlewares');
const chatController = require('../controllers/chat.controller');
const config = require('../config');

module.exports = (app) => {
    app.post(config.GET_CHAT_URL, [authJWT.verifyToken], chatController.getChat);
};