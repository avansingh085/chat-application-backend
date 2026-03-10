const Conversation = require("../../models/conversation.model");
const Message = require("../../models/message.model");
const { safeRedisGet, safeRedisSet } = require("../../config/redis.config");

module.exports = (io, socket) => {

  socket.on("message", async (mes) => {
    try {

      const conversation = await Conversation.findById(mes.conversationId);
      if (!conversation) return;

      const participants = conversation.participants;

      for (const participant of participants) {

        if (participant === mes.sender) continue;

        const notificationKey = `${participant}-${mes.conversationId}`;

        let notifRaw = await safeRedisGet(`Notifications-${notificationKey}`);

        let notif = notifRaw
          ? typeof notifRaw === "string"
            ? JSON.parse(notifRaw)
            : notifRaw
          : { count: 0 };

        const newCount = (notif.count || 0) + 1;

        await safeRedisSet(
          `Notifications-${notificationKey}`,
          JSON.stringify({ count: newCount })
        );

        let userRaw = await safeRedisGet(`Users-${participant}`);

        if (!userRaw) continue;

        const userData =
          typeof userRaw === "string" ? JSON.parse(userRaw) : userRaw;

        if (userData.isOnline && userData.socketId) {

          io.to(userData.socketId).emit("message", mes);

          io.to(userData.socketId).emit("notification", {
            count: newCount,
            notificationKey
          });

        }
      }

      const newMessage = new Message(mes);
      await newMessage.save();

    } catch (err) {
      console.log("Message handler error:", err);
    }
  });

};