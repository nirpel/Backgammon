const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth.config');
const db = require('../models');
const User = db.user;

signUp = async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        res.status(200).send({ message: 'User registered successfully' });
    })
}

signIn = (req, res) => {
    User.findOne({
        username: req.body.username
    }).exec(async (err, user) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        if (user) {
            let isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordValid) {
                let token = jwt.sign({ id: user._id }, authConfig.secret);
                return res.status(200).send({
                    id: user._id,
                    username: user.username,
                    accessToken: token
                });
            } else {
                return res.status(403).send({
                    accessToken: null,
                    message: 'Password is incorrect'
                });
            }
        } else {
            res.status(404).send({ message: `User ${req.body.username} not found`});
        }
    });
}

signOut = (req, res) => {
    return res.status(200).send({
        accessToken: null,
        message: `User ${req.username} logged out successfully`
    });
}

const authController = {
    signUp,
    signIn,
    signOut
};
module.exports = authController;