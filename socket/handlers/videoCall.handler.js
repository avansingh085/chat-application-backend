const Conversation = require("../../models/conversation.model");
const { safeRedisGet } = require("../../config/redis.config");

module.exports = (io, socket) => {

  socket.on("offer-video-call", async ({ roomId, userName }) => {

    const conversation = await Conversation.findById(roomId);
    if (!conversation) return;

    for (const participant of conversation.participants) {

      if (participant === userName) continue;

      const raw = await safeRedisGet(`Users-${participant}`);
      if (!raw) continue;

      const data = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (data.isOnline && data.socketId) {
        io.to(data.socketId).emit("offer-video-call", { roomId, userName });
      }

    }

  });

  socket.on("end-video-call", async ({ roomId, userName }) => {

    const conversation = await Conversation.findById(roomId);
    if (!conversation) return;

    for (const participant of conversation.participants) {

      const raw = await safeRedisGet(`Users-${participant}`);
      if (!raw) continue;

      const data = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (data.isOnline && data.socketId) {
        io.to(data.socketId).emit("end-video-call", { roomId, userName });
      }

    }

  });

};