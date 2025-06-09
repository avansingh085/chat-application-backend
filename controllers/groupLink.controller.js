const groupLinkService = require('../services/groupLink.service');

const genrateLink = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ success: false, message: 'Conversation ID is required' });
        }

        const joinLink = await groupLinkService.generateJoinLink(conversationId);
        return res.status(200).json({ success: true, joinLink });
    } catch (err) {
        console.error('Error generating link:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const joinGroupUsingLink = async (req, res) => {
    try {
        const { groupJoinId, conversationId } = req.params;
        const { id: userId } = req.body;

        if (!groupJoinId || !conversationId || !userId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        await groupLinkService.joinGroupUsingLink(groupJoinId, conversationId, userId);
        return res.status(200).json({ success: true, message: 'User added to group successfully' });
    } catch (err) {
        console.error('Error joining group:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    genrateLink,
    joinGroupUsingLink
};
