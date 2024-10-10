const Log = require('../models/logModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const moment = require('moment-timezone'); 

// Fonction pour vérifier si l'utilisateur est admin
const isAdmin = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.role === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};




const getAllLogs = async (req, res) => {
  if (!(await isAdmin(req.headers.authorization))) {
    return res.status(403).json({ message: 'Access denied, insufficient permissions' });
  }

  try {
    let logs = await Log.find().sort({ timestamp: -1 });

    // Convertir les timestamps en heure de Paris pour tous les champs de date
    logs = logs.map(log => ({
      ...log._doc,
      timestamp: moment(log.timestamp).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      createdAt: moment(log.createdAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      updatedAt: moment(log.updatedAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }));

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs' });
  }
};



// Voir les dernières actions d'un utilisateur spécifique
const getLogsByUserEmail = async (req, res) => {
    if (!(await isAdmin(req.headers.authorization))) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }
  
    try {
      const { email } = req.params;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé avec cet email' });
      }
  
      let logs = await Log.find({ userEmail: email }).sort({ timestamp: -1 });
  
      logs = logs.map(log => ({
        ...log._doc,
        timestamp: moment(log.timestamp).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        createdAt: moment(log.createdAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        updatedAt: moment(log.updatedAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      }));
  
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs pour cet utilisateur' });
    }
  };
  

// Voir les dernières actions sur une fonctionnalité spécifique
const getLogsByFeature = async (req, res) => {
    if (!(await isAdmin(req.headers.authorization))) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }
  
    try {
      const { feature } = req.params;
  
      let logs = await Log.find({ feature }).sort({ timestamp: -1 });
  
      logs = logs.map(log => ({
        ...log._doc,
        timestamp: moment(log.timestamp).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        createdAt: moment(log.createdAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        updatedAt: moment(log.updatedAt).tz("Europe/Paris").format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      }));
  
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs pour cette fonctionnalité' });
    }
  };
  

module.exports = { getAllLogs, getLogsByUserEmail, getLogsByFeature };
