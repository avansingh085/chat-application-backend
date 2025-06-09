const express = require('express');
const router = express.Router();
const groupLinkController = require('../controllers/groupLink.controller');

// Generate join link
router.get('/generate/:conversationId', groupLinkController.genrateLink);

// Join group using link
router.post('/:groupJoinId/:conversationId/joinLink', groupLinkController.joinGroupUsingLink);

module.exports = router;
