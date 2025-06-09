
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/server.config");

const verifyToken = (token) => {
    
    return jwt.verify(token, JWT_SECRET);
};

const destroyToken = () => {
    return null; // Optional: blacklist logic
};

module.exports = { verifyToken, destroyToken };
