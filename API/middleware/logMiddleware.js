const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Log = require('../models/logModel');
const moment = require('moment-timezone'); // Importer moment-timezone

// Mapping entre les URLs de base et les noms de features
const featureMapping = {
  '/api/tools/check_email': 'check_email',
  '/api/tools/generate-password': 'generate_password',
  '/api/tools/send-email-spam': 'send_email_spam',
  '/api/tools/create-phishing-page': 'create_phishing_page',
  '/api/logs/all': 'get_all_logs',
  '/api/logs/user': 'get_user_logs',
  '/api/logs/feature': 'get_feature_logs',
  // Ajoute ici d'autres URLs si nécessaire
};

const logMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  let user = null;

  // Vérifier si le token JWT est présent
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select('_id email username');
    } catch (error) {
      console.error('Erreur de validation du token pour le log:', error.message);
      // Ne rien faire si l'utilisateur n'est pas trouvé ou si le token est invalide
    }
  }

  // Capture du code de statut après l'envoi de la réponse
  res.on('finish', async () => {
    if (user) {
      let feature = 'unknown_feature';
      const baseUrl = req.originalUrl.split('?')[0]; // Supprimer les query params
      const parts = baseUrl.split('/');

      if (baseUrl.startsWith('/api/logs/user/')) {
        feature = 'get_user_logs';
      } else if (baseUrl.startsWith('/api/logs/feature/')) {
        feature = 'get_feature_logs';
      } else {
        // Utiliser l'URL jusqu'au 3ème segment maximum, puis rechercher dans le mapping
        const key = `/${parts[1]}/${parts[2]}` + (parts[3] ? `/${parts[3]}` : '');
        feature = featureMapping[key] || 'unknown_feature';
      }

      // Convertir l'heure actuelle en heure de Paris et la forcer en tant qu'objet Date
      const parisTime = moment().tz("Europe/Paris").toDate(); 

      await Log.create({
        user: user._id,
        userEmail: user.email,
        action: `${req.method} request to ${baseUrl}`,
        feature: feature,
        statusCode: res.statusCode,
        timestamp: parisTime, // Utiliser l'objet Date correspondant à l'heure de Paris
      });
    }
  });

  next();
};

module.exports = logMiddleware;
