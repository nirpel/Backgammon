const db = require('../data-access/models');
const User = db.user;

checkDuplicateUserName = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        if (user) {
            res.status(403).send({ message: `Username ${req.body.username} already in use` });
            return;
        }
    });
    next();
}

const verifySignUp = {
    checkDuplicateUserName
};

module.exports = verifySignUp;