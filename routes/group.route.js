const express = require('express');
const groupController = require('../controllers/group.controller');
const { verifyToken } = require('../utils/token.util');
const { checkToken } = require('../controllers/auth.controller');
const router = express.Router();

router.use(checkToken)

// Generate join link
router.get('/generate/:conversationId', groupController.genrateLink);

// Join group using link
router.post('/:groupJoinId/:conversationId/joinLink', groupController.joinGroupUsingLink);
 router.put('/',groupController.updateGroup);
 router.post('/add/:conversationId',groupController.addNewMember);
module.exports = router;
