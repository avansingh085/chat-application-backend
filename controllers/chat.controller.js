const chatService = require("../services/chat.service");

const createConversation = async (req, res) => {
    const response = await chatService.createConversation(req.body);
    return res.status(response.status).json(response);
};

const createGroup = async (req, res) => {
    const response = await chatService.createGroup(req.body);
    return res.status(response.status).json(response);
};

const getConversation = async (req, res) => {
    const response = await chatService.getConversation(req.user.id);
    return res.status(response.status).json(response);
};

const makeAdmin = async (req, res) => {
    const response = await chatService.makeAdmin(req.body);
    return res.status(response.status).json(response);
};

module.exports = {
    createConversation,
    createGroup,
    getConversation,
    makeAdmin,
};
