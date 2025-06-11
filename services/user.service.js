const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const Group = require("../models/groupMetadata.model");

const getUser = async (id) => {
    if (!id) return { status: 400, success: false, message: "Id is required" };

    try {
        const user = await User.findById(id);
        if (!user) return { status: 404, success: false, message: "User not found" };

        const Chat = {};
        const ContactData = {};

        await Promise.all(user.contacts.map(async (conversationId) => {
            const [messages, conversation, group] = await Promise.all([
                Message.find({ conversationId }),
                Conversation.findById(conversationId),
                Group.findOne({ conversationId })
            ]);

            Chat[conversationId] = { Message: messages, Conversation: conversation, Group: group };

            for (const participant of conversation.participants) {
                if (participant !== user.userId && !ContactData[participant]) {
                    const contact = await User.findOne({ userId: participant }, { userId: 1, email: 1, profilePicture: 1, lastSeen: 1, status: 1 });
                    ContactData[participant] = contact;
                }
            }
        }));
        return { status: 200, success: true, User: user, Chat, ContactData };
    } catch (error) {
        console.log("Error fetching user data:", error);
        return { status: 500, success: false, message: "Server error" };
    }
};

const updateProfile = async ({ userId, status, profilePicture }) => {
    if (!userId) return { status: 400, success: false, message: "User ID is required" };
  
    try {
        await User.findOneAndUpdate({ userId }, { $set: { status, profilePicture } });
        return { status: 200, success: true, message: "Profile updated successfully" };
    } catch (error) {
        return { status: 500, success: false, message: "Server error during profile update" };
    }
};

module.exports = { getUser, updateProfile };
