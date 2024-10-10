const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { promoteUserToAdminByEmail, setPermissionsForUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/promote', promoteUserToAdminByEmail);
router.put('/permissions', setPermissionsForUser);




module.exports = router;
