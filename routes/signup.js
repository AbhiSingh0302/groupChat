const express = require('express');

const signupController = require('../controller/signup');

const middlewareFunction = require('../middleware/auth');

const router = express.Router();

router.post('/user/signup',middlewareFunction.encrypt,signupController.signupreq);

router.get('/',signupController.signuppage);

module.exports = router;

