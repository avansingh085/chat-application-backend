const { verifyToken} = require("../utils/token.util");
  const verifySocketAuth=(socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = verifyToken(token);
    socket.user = decoded; 
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
}
module.exports=verifySocketAuth;