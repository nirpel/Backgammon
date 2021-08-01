const { authJWT } = require('../middlewares');
const userController = require('../controllers/user.controller');
const config = require('../config');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get(config.TEST_URL + '/all', userController.getPublicContent);
    app.get(config.TEST_URL + '/user', [authJWT.verifyToken], userController.getUserContent);
};