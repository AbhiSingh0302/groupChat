const express = require('express');

const groupCont = require('../controller/group')
const middleware = require('../middleware/auth');

const router = express.Router();

router.post('/group/create',middleware.authorization,groupCont.createGroup);
router.post('/group/join/:id',middleware.authorization,groupCont.joinGroup);
router.get('/group/all',middleware.authorization,groupCont.allGroup);
router.get('/group/joined/:username',middleware.authorization,groupCont.joinedGroup);

module.exports = router;

