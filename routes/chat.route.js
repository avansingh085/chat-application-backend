const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const checkToken=require('../middlewares/verifyToken.js');
router.use(checkToken);
router.post("/conversation", chatController.createConversation);
router.post("/group", chatController.createGroup);
router.post("/conversation/get", chatController.getConversation);
router.post("/group/make-admin", chatController.makeAdmin);

module.exports = router;
