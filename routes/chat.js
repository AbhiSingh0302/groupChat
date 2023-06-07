const express = require('express');

const path = require('path');

const chatController = require('../controller/chat');

const middleware = require('../middleware/auth');

const router = express.Router();

router.get('/chat/user',middleware.authorization,chatController.registeredUsers);
router.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','public/chat/','chat.html'));
})

module.exports = router;

