const express = require('express');
const { checkEmailExistence, generateSecurePassword, sendEmailSpam, checkPasswordStrength, getSubdomains, generateFakeIdentity, ddos} = require('../controllers/toolController');
const router = express.Router();

router.post('/check_email', checkEmailExistence);
router.post('/generate-password', generateSecurePassword);
router.post('/send-email-spam', sendEmailSpam)
router.post('/check_password_strength', checkPasswordStrength)
router.post('/getSubdomains', getSubdomains)
router.get('/generateFakeIdentity',generateFakeIdentity)
router.post('/ddos',ddos)


module.exports = router;
