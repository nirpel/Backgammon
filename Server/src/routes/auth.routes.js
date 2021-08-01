const { verifySignUp } = require('../middlewares');
const authController = require('../controllers/auth.controller');
const config = require('../config');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        next();
    });

    app.post(config.SIGN_UP_URL, [verifySignUp.checkDuplicateUserName], authController.signUp);
    app.post(config.SIGN_IN_URL, authController.signIn);
};