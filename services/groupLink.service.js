const { v4: uuidv4 } = require('uuid');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');
const UidMapWithConversation = require('../utils/uidMap');

const generateJoinLink = async (conversationId) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const groupJoinId = uuidv4();
    UidMapWithConversation[conversationId] = groupJoinId;

    // Set timeout to delete after 10 hours
    setTimeout(() => {
        delete UidMapWithConversation[conversationId];
    }, 10 * 60 * 60 * 1000);

    const joinLink = `http://localhost:3001/group/${groupJoinId}/${conversationId}/joinLink`;
    return joinLink;
};

const joinGroupUsingLink = async (groupJoinId, conversationId, userId) => {
    if (!UidMapWithConversation[conversationId] || UidMapWithConversation[conversationId] !== groupJoinId) {
        throw new Error('Invalid groupJoinId');
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!conversation.participants.includes(user._id)) {
        conversation.participants.push(user._id);
        await conversation.save();
    }

    return true;
};

module.exports = {
    generateJoinLink,
    joinGroupUsingLink
};
