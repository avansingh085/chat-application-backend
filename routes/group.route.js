const express = require('express');
const groupController = require('../controllers/group.controller');
const { verifyToken } = require('../utils/token.util');
const { checkToken } = require('../controllers/auth.controller');
const router = express.Router();

router.use(checkToken)

router.get('/generate/:conversationId', groupController.genrateLink);

router.post('/join/:groupJoinId', groupController.joinGroupUsingLink);

router.post('/add/:conversationId', groupController.addNewMember);

router.put('/', groupController.updateGroup);

module.exports = router;