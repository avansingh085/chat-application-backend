const mongoose = require("mongoose");
const ConversationSchema = new mongoose.Schema({
    participants: [{ type: String, ref: "User", required: true }], 
    type: { type: String, enum: ["personal", "group"], required: true },
    
    createdAt: { type: Date, default: Date.now },
    lastMessage: {
      messageId: { type: String, ref: "Message" },
      content: { type: String }, 
      timestamp: { type: Date }, 
    },
  });
  module.exports = mongoose.model("Conversation", ConversationSchema);
  