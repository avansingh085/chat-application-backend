const cookie = require("cookie");
const { verifyToken } = require("../utils/token.util");

const verifySocketAuth = (socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.ChatsToken;

    if (!token) return next(new Error("Unauthorized"));

    const decoded = verifyToken(token);
    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};

module.exports = verifySocketAuth;