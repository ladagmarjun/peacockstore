const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

router.get('/me',       auth.me);
router.post('/login',   auth.login);
router.post('/register',auth.register);
router.post('/logout',  auth.logout);

module.exports = router;
