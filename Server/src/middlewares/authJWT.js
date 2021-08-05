const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../data-access/models');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ message: "No token provided" });
    }
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            res.status(401).send({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
}

const authJWT = { verifyToken };
module.exports = authJWT;