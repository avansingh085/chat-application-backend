const mongoose = require("mongoose");

const joinLinkSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    groupJoinId: {
      type: String,
      required: true,
      unique: true,
    },

    joinLinkExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const JoinLink = mongoose.model("JoinLink", joinLinkSchema);

module.exports = JoinLink;