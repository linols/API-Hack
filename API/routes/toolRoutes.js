const express = require('express');
const { checkEmailExistence, generateSecurePassword } = require('../controllers/toolController');
const router = express.Router();

router.post('/check_email', checkEmailExistence);
router.post('/generate-password', generateSecurePassword);


module.exports = router;
