const { verifySignUp } = require('../middlewares');
const authController = require('../controllers/auth.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        next();
    });

    app.post(process.env.SIGN_UP_URL, [verifySignUp.checkDuplicateUserName], authController.signUp);
    app.post(process.env.SIGN_IN_URL, authController.signIn);
    app.post(process.env.SIGN_OUT_URL, authController.signOut);
};