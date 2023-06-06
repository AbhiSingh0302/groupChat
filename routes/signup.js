const express = require('express');

const signupController = require('../controller/signup');

const router = express.Router();

router.post('/user/signup',signupController.signupreq)

router.get('/',signupController.signuppage)

module.exports = router;

