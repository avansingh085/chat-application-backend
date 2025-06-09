const mongoose = require("mongoose");

const GroupMetadataSchema = new mongoose.Schema({
    conversationId: { type: String, ref: "Conversation", required: true },
    groupName: { type: String, required: true },
    adminIds: [{ type: String, ref: "User" }],
    groupPicture: { type: String, default: "" }, 
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("GroupMetadata", GroupMetadataSchema);
  