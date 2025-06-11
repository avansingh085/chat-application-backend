const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

// Generate join link
router.get('/generate/:conversationId', groupController.genrateLink);

// Join group using link
router.post('/:groupJoinId/:conversationId/joinLink', groupController.joinGroupUsingLink);
 router.put('/',groupController.updateGroup);
 router.get('/add/:conversationId',groupController.addNewMember);
module.exports = router;
