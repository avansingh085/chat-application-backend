const { Server } = require("socket.io");
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

const Users = {};
const Notifications = {};

const socketHandler = (server) => {

  console.log("Socket server started");
  
  try {
    const io = new Server(server, {
      cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);
      const userId = socket.handshake.query.userId;
      Users[userId] = { isOnline: true, socketId: socket.id };

      socket.on("deleteNotification", (notificationKey) => {
        Notifications[notificationKey] = { count: 0 };
        socket.emit("notification", {
          count: 0,
          notificationKey
        });
      });

      socket.on("notification", (notificationKey) => {
        socket.emit("notification", {
          count: Notifications[notificationKey]?.count || 0,
          notificationKey
        });
      });

      socket.on("disconnect", () => {
        if (Users[userId]) {
          Users[userId].isOnline = false;
          Users[userId].socketId = null;
        }
      });

      socket.on("message", async (mes) => {
        let conversation = await Conversation.findById(mes.conversationId);
        let participants = conversation.participants;

        for (const participant of participants) {
          const notificationKey = `${participant}-${mes.conversationId}`;
          if (participant !== mes.sender) {
            Notifications[notificationKey] = {
              count: (Notifications[notificationKey]?.count || 0) + 1
            };
          }

          if (Users[participant]?.isOnline && participant !== mes.sender) {
            io.to(Users[participant].socketId).emit("message", mes);
            io.to(Users[participant].socketId).emit("notification", {
              count: Notifications[notificationKey].count,
              notificationKey
            });
          }
        }

        const newMessage = new Message(mes);
        await newMessage.save();
      });

      socket.on("offer-video-call", async ({ roomId, userName }) => {
        try {
          let conversation = await Conversation.findById(roomId);
          console.log('offer-video-call');
          let participants = conversation.participants;
          console.log(participants,roomId,userName)

          for (const participant of participants) {
            if (Users[participant]?.isOnline && participant !== userName) {
              io.to(Users[participant].socketId).emit("offer-video-call", { roomId, userName });

            }
          }
        } catch (err) {
          console.log("error during offer-video-call websocket", err);
        }


      });



      socket.on("end-video-call", async ({ roomId, userName }) => {
        try{
        let conversation = await Conversation.findById(roomId);
        console.log('end-video-call');
        let participants = conversation.participants;

        console.log(participants);
        for (const participant of participants) {
          if (Users[participant]?.isOnline) {

            io.to(Users[participant].socketId).emit("end-video-call", { roomId, userName });

          }
        }
      }catch(err){
        console.log('error during end-video-call',err);
      }
      });
    });



  } catch (error) {
    console.log("Socket server error:", error);
  }
};

module.exports = socketHandler;
