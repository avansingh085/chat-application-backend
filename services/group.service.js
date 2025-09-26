const { v4: uuidv4 } = require('uuid');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');
const groupAutoDelete=require('../models/groupAutoDelete.model.js');
const UidMapWithConversation = require('../utils/uidMap');
const groupMetadataModel = require('../models/groupMetadata.model');
const updateGroup = async (groupId, data) => {
    const group = await groupMetadataModel.findById(groupId);
    if (!group)
        throw new Error('group not found');
    group.groupPicture = data.groupPicture;
    group.groupName = data.groupName;
    await group.save();
    return { data: group, error: null };

}
const addNewMember = async ({ userId, conversationId, newUser }) => {

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const user = await User.findOne({ userId: newUser });

    
    if (!user) throw new Error('User not found');

    const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await groupAutoDelete.create({conversationId:conversation._id,userId:user._id,date:oneYearLater})

    if (!conversation.participants.includes(user._id)) {
        conversation.participants.push(user._id);
        user.contacts.push(conversationId);
        await user.save();
        await conversation.save();
    }
    return { data: {}, error: null };

}
const generateJoinLink = async (conversationId) => {

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const groupJoinId = uuidv4();
    UidMapWithConversation[conversationId] = groupJoinId;

    // Set timeout to delete after 10 hours
    setTimeout(() => {
        delete UidMapWithConversation[conversationId];
    }, 10 * 60 * 60 * 1000);

    const joinLink = `http://localhost:3001/api/group/${groupJoinId}/${conversationId}/joinLink`;
    return joinLink;
};

const joinGroupUsingLink = async (groupJoinId, conversationId, userId) => {
    if (!UidMapWithConversation[conversationId] || UidMapWithConversation[conversationId] !== groupJoinId) {
        throw new Error('Invalid groupJoinId');
    }


    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const user = await User.findOne({ userId });

    if (!user) throw new Error('User not found');

    if (!conversation.participants.includes(user._id)) {
        conversation.participants.push(user._id);
        
         const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await groupAutoDelete.create({conversationId:conversation._id,userId:user._id,date:oneYearLater})
        await conversation.save();
        await User.updateOne(
            { userId: user.userId },
            { $addToSet: { contacts: conversation._id } }
        );
    }

    return true;
};

module.exports = {
    generateJoinLink,
    joinGroupUsingLink,
    addNewMember,
    updateGroup
};
