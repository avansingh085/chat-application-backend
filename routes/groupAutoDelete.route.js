const { checkToken } = require('../controllers/auth.controller');
const GroupAutoDeleteController =require('../controllers/groupAutoDelete.controller.js');
const express=require('express');

const router=express.Router();

router.use(checkToken);

router.get('/:conversationId',GroupAutoDeleteController.getGroupAutoDeleteByConversationIdAndUserId);

router.post('/',GroupAutoDeleteController.create);

router.put('/:id',GroupAutoDeleteController.update);

module.exports=router;



