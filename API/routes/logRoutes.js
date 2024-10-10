const express = require('express');
const { getAllLogs, getLogsByUserEmail, getLogsByFeature } = require('../controllers/logController');
const router = express.Router();

// Route pour obtenir tous les logs (accessible uniquement aux admins)
router.get('/all', getAllLogs);

// Route pour obtenir les dernières actions d'un utilisateur spécifique (par ID)
router.get('/user/email/:email', getLogsByUserEmail);

// Route pour obtenir les dernières actions sur une fonctionnalité spécifique
router.get('/feature/:feature', getLogsByFeature);

module.exports = router;
