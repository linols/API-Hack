const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Log = require('../models/logModel');
const moment = require('moment-timezone'); 


const featureMapping = {
  '/api/tools/check_email': 'check_email',
  '/api/tools/generate-password': 'generate_password',
  '/api/tools/send-email-spam': 'send_email_spam',
  '/api/tools/check_password_strength' : 'check_password_strength',
  '/api/tools/generateFakeIdentity' : 'generateFakeIdentity',
  'api/tools/ddos' : 'ddos',
  '/api/tools/phishing': 'phishing',
  '/api/tools/write-to-file': 'write-to-file',
  '/api/logs/all': 'get_all_logs',
  '/api/logs/user': 'get_user_logs',
  '/api/logs/feature': 'get_feature_logs',
  'api/logs/randomPersonImage' : 'get_random_person_image',
  'api/logs/search_person_links' : 'search_person_links'
};

const logMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select('_id email username');
    } catch (error) {
      console.error('Erreur de validation du token pour le log:', error.message);
    }
  }

  res.on('finish', async () => {
    if (user) {
      let feature = 'unknown_feature';
      const baseUrl = req.originalUrl.split('?')[0];
      const parts = baseUrl.split('/');

      if (baseUrl.startsWith('/api/logs/user/')) {
        feature = 'get_user_logs';
      } else if (baseUrl.startsWith('/api/logs/feature/')) {
        feature = 'get_feature_logs';
      } else {
        const key = `/${parts[1]}/${parts[2]}` + (parts[3] ? `/${parts[3]}` : '');
        feature = featureMapping[key] || 'unknown_feature';
      }

      const parisTime = moment().tz("Europe/Paris").toDate(); 

      await Log.create({
        user: user._id,
        userEmail: user.email,
        action: `${req.method} request to ${baseUrl}`,
        feature: feature,
        statusCode: res.statusCode,
        timestamp: parisTime,
      });
    }
  });

  next();
};

module.exports = logMiddleware;
