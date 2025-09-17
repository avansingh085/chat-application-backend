
const groupService = require('../services/group.service');


const addNewMember = async (req, res) => {
    try {
       
        const { data, error } = await groupService.addNewMember({ userId: req.user.id,newUser:req.body?.newUser, conversationId: req.params.conversationId });
        if (!error)
            return res.status(200).send({ success: true, message: "new member successfully added" });
        return res.status(500).send({ success: false, message: "failed to add member ", error })
    } catch (error) {
        return res.status(501).send({ success: false, message: "failed to add new member", error });
    }

}

const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { data, error } = await groupService.updateGroup(groupId, req.body);
        if (!error)
            return res.status(200).send({ message: "group updated successfully", success: true });
        return res.status(500).send({ message: "failed to update group", error });
    }
    catch (error) {
        return res.status(501).send({ message: "failed to update group", error });
    }
}
const genrateLink = async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log(conversationId)
        if (!conversationId) {
            return res.status(400).json({ success: false, message: 'Conversation ID is required' });
        }

        const joinLink = await groupService.generateJoinLink(conversationId);
        return res.status(200).json({ success: true, joinLink });
    } catch (err) {
        console.error('Error generating link:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

const joinGroupUsingLink = async (req, res) => {
    try {
        
        const { groupJoinId, conversationId } = req.params;
        console.log(req.params)
        const { id: userId } = req.body;
        console.log(req.body)

        if (!groupJoinId || !conversationId || !userId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
   
        await groupService.joinGroupUsingLink(groupJoinId, conversationId, userId);
       
        return res.status(200).json({ success: true, message: 'User added to group successfully' });
    } catch (err) {
        console.error('Error joining group:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    genrateLink,
    joinGroupUsingLink,
    addNewMember,
    updateGroup
};
