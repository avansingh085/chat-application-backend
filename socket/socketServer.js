const { Server } = require("socket.io");
const Conversation = require('../models/conversation.model.js');
const Message = require('../models/message.model.js');
const { safeRedisGet, safeRedisSet } = require('../config/redis.config.js');

const socketHandler = (server) => {
  console.log("Socket server started");

  try {
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

    io.on("connection", async (socket) => {
      console.log("New client connected", socket.id);
      const userId = socket.handshake.query.userId;

      if (userId) {
        await safeRedisSet(`Users-${userId}`, JSON.stringify({ isOnline: true, socketId: socket.id }));
      }

      socket.on("deleteNotification", async (notificationKey) => {
        await safeRedisSet(`Notifications-${notificationKey}`, JSON.stringify({ count: 0 }));
        socket.emit("notification", {
          count: 0,
          notificationKey
        });
      });

      socket.on("notification", async (notificationKey) => {
        const rawData = await safeRedisGet(`Notifications-${notificationKey}`);
        const data = rawData ? (typeof rawData === 'string' ? JSON.parse(rawData) : rawData) : { count: 0 };
        socket.emit("notification", {
          count: data.count,
          notificationKey
        });
      });

      socket.on("disconnect", async () => {
        if (userId) {
          await safeRedisSet(`Users-${userId}`, JSON.stringify({ isOnline: false, socketId: null }));
        }
      });

      socket.on("message", async (mes) => {
        try {
          let conversation = await Conversation.findById(mes.conversationId);
          if (!conversation) return;
          
          let participants = conversation.participants;

          for (const participant of participants) {
            const notificationKey = `${participant}-${mes.conversationId}`;

            if (participant !== mes.sender) {
              let currentNotifRaw = await safeRedisGet(`Notifications-${notificationKey}`);
              let currentNotif = currentNotifRaw ? (typeof currentNotifRaw === 'string' ? JSON.parse(currentNotifRaw) : currentNotifRaw) : { count: 0 };

              const newCount = (currentNotif.count || 0) + 1;
            
              await safeRedisSet(`Notifications-${notificationKey}`, JSON.stringify({ count: newCount }));

              let participantDataRaw = await safeRedisGet(`Users-${participant}`);
              if (participantDataRaw) {
                const participantData = typeof participantDataRaw === 'string' ? JSON.parse(participantDataRaw) : participantDataRaw;

                if (participantData.isOnline && participantData.socketId) {
                  io.to(participantData.socketId).emit("message", mes);
                  io.to(participantData.socketId).emit("notification", {
                    count: newCount,
                    notificationKey
                  });
                }
              }
            }
          }

          const newMessage = new Message(mes);
          await newMessage.save();
        } catch (err) {
          console.log("Error in message handler:", err);
        }
      });

      socket.on("offer-video-call", async ({ roomId, userName }) => {
        try {
          let conversation = await Conversation.findById(roomId);
          if (!conversation) return;

          let participants = conversation.participants;

          for (const participant of participants) {
            let participantDataRaw = await safeRedisGet(`Users-${participant}`);

            if (participantDataRaw) {
              const participantData = typeof participantDataRaw === 'string' ? JSON.parse(participantDataRaw) : participantDataRaw;

              if (participantData.isOnline && participant !== userName && participantData.socketId) {
                io.to(participantData.socketId).emit("offer-video-call", { roomId, userName });
              }
            }
          }
        } catch (err) {
          console.log("error during offer-video-call websocket", err);
        }
      });

      socket.on("end-video-call", async ({ roomId, userName }) => {
        try {
          let conversation = await Conversation.findById(roomId);
          if (!conversation) return;

          let participants = conversation.participants;

          for (const participant of participants) {
            let participantDataRaw = await safeRedisGet(`Users-${participant}`);

            if (participantDataRaw) {
              const participantData = typeof participantDataRaw === 'string' ? JSON.parse(participantDataRaw) : participantDataRaw;

              if (participantData.isOnline && participantData.socketId) {
                io.to(participantData.socketId).emit("end-video-call", { roomId, userName });
              }
            }
          }
        } catch (err) {
          console.log('error during end-video-call', err);
        }
      });
    });

  } catch (error) {
    console.log("Socket server error:", error);
  }
};

module.exports = socketHandler;