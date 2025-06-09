const userService = require("../services/user.service");

const getUser = async (req, res) => {
    const response = await userService.getUser(req.user.id);
    return res.status(response.status).json(response);
};

const updateProfile = async (req, res) => {
    const response = await userService.updateProfile(req.body);
    return res.status(response.status).json(response);
};

module.exports = { getUser, updateProfile };
