const Conversation = require("../models/conversation.model");
const Group = require("../models/groupMetadata.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");

const createConversation = async ({ participants, type, groupName }) => {
    try {
        if (!participants || !type) {
            return { status: 400, success: false, message: "Participants and type required" };
        }

        if (type === "group" && !groupName) {
            return { status: 400, success: false, message: "Group name is required" };
        }

        const conversation = await Conversation.create({ participants, type });

        // Update each participant's contacts safely
        await Promise.all(
            participants.map(async (participant) => {
                await User.updateOne(
                    { userId: participant },
                    { $addToSet: { contacts: conversation._id } }
                );
            })
        );

        // If group, create metadata with unique admins
        if (type === "group") {
            const uniqueAdmins = [...new Set(participants)];
            await Group.create({
                conversationId: conversation._id,
                groupName,
                adminIds: uniqueAdmins,
            });
        }

        return { status: 200, success: true, conversation };
    } catch (error) {
        console.error("Error creating conversation:", error);
        return { status: 500, success: false, message: "Server error" };
    }
};

const createGroup = async ({ adminIds, groupName, ConversationId, groupPicture }) => {

    if (!adminIds || !groupName || !ConversationId || !groupPicture) {
        return { status: 400, success: false, message: "All fields are required" };
    }


    try {
        const group = await Group.create({ adminIds, groupName, conversationId: ConversationId, groupPicture });
        return { status: 200, success: true, group };
    } catch (error) {
        return { status: 500, success: false, message: "Server error during group creation" };
    }
};

const getConversation = async (id) => {
    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) return { status: 404, success: false, message: "Conversation not found" };
        return { status: 200, success: true, conversation };
    } catch (error) {
        return { status: 500, success: false, message: "Server error" };
    }
};

const makeAdmin = async ({ userId, currAdmin, groupId }) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) return { status: 404, success: false, message: "Group not found" };

        const isAdmin = group.adminIds.includes(currAdmin);
        if (!isAdmin) return { status: 403, success: false, message: "You are not an admin" };

        if (!group.adminIds.includes(userId)) {
            group.adminIds.push(userId);
            await group.save();
        }

        return { status: 200, success: true, group };
    } catch (error) {
        return { status: 500, success: false, message: "Error making admin" };
    }
};

module.exports = {
    createConversation,
    createGroup,
    getConversation,
    makeAdmin,
};
