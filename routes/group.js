const express = require('express');

const groupCont = require('../controller/group')
const middleware = require('../middleware/auth');

const router = express.Router();

router.post('/group/create/:userid',middleware.authorization,groupCont.createGroup);
router.get('/group/all/:userid',middleware.authorization,groupCont.allGroup);
router.post('/group/adduser/:username',middleware.authorization,groupCont.addUserToGroup);
router.post('/group/adminuser/:username',middleware.authorization,groupCont.addAdminToGroup);
router.get('/group/groupchat/:groupid',middleware.authorization,groupCont.groupChats);
router.post('/group/sendchat/:userid',middleware.authorization,groupCont.sendChatToGroup);

module.exports = router;

