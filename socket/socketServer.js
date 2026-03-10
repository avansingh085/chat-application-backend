const { Server } = require("socket.io");
const verifySocketAuth = require("../middlewares/verifySocketAuth");

const messageHandler = require("./handlers/message.handler");
const notificationHandler = require("./handlers/notification.handler");
const videoCallHandler = require("./handlers/videoCall.handler");

const { setUserOnline, setUserOffline } = require("../services/presence.service");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://chat-application-henna-iota.vercel.app",
        "https://avansingh.in"
      ],
      credentials: true
    }
  });

  io.use(verifySocketAuth);

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    const userId = socket.user.id;

    await setUserOnline(userId, socket.id);

    notificationHandler(socket);
    messageHandler(io, socket);
    videoCallHandler(io, socket);

    socket.on("disconnect", async () => {
      await setUserOffline(userId);
      console.log("User disconnected:", userId);
    });
  });
};

module.exports = socketHandler;