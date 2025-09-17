const express = require('express');
const groupController = require('../controllers/group.controller');
const { verifyToken } = require('../utils/token.util');
const { checkToken } = require('../controllers/auth.controller');
const router = express.Router();

router.use(checkToken)

///api/generate/68ca50a3040d3b547a4ddea2
router.get('/generate/:conversationId', groupController.genrateLink);

router.post('/:groupJoinId/:conversationId/joinLink', groupController.joinGroupUsingLink);

// Add new member
router.post('/add/:conversationId', groupController.addNewMember);

// Update group (generic)
router.put('/', groupController.updateGroup);

module.exports = router;