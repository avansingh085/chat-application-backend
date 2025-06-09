const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    conversationId: { type: String, ref: "Conversation", required: true }, 
    sender: { type: String, ref: "User", required: true }, 
    message: { type: String, default: "" },
    imageUrl: { type: String, default: null }, 
    timestamp: { type: Date, default: Date.now }, 
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    reactions: {
      type: Map,
      of: String,
    },
    deletedFor: [{ type: String, ref: "User" }],
    readBy: [{ type: String, ref: "User" }],
  });
  
  module.exports = mongoose.model("Message", MessageSchema);
  