const Log = require('../models/logModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const moment = require('moment-timezone');

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


const paginate = (model, page, limit) => {
  const skip = (page - 1) * limit;
  return model.skip(skip).limit(limit);
};


const getAllLogs = async (req, res) => {
  if (!(await isAdmin(req.headers.authorization))) {
    return res.status(403).json({ message: 'Access denied, insufficient permissions' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let logsQuery = Log.find().sort({ timestamp: -1 });
    const logs = await paginate(logsQuery, page, limit);

    const formattedLogs = logs.map((log) => ({
      ...log._doc,
      timestamp: moment(log.timestamp).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      createdAt: moment(log.createdAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      updatedAt: moment(log.updatedAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }));

    res.status(200).json({
      currentPage: page,
      totalItems: await Log.countDocuments(),
      totalPages: Math.ceil(await Log.countDocuments() / limit),
      logs: formattedLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs' });
  }
};


const getLogsByUserEmail = async (req, res) => {
  if (!(await isAdmin(req.headers.authorization))) {
    return res.status(403).json({ message: 'Access denied, insufficient permissions' });
  }

  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé avec cet email' });
    }

    let logsQuery = Log.find({ userEmail: email }).sort({ timestamp: -1 });
    const logs = await paginate(logsQuery, page, limit);

    const formattedLogs = logs.map((log) => ({
      ...log._doc,
      timestamp: moment(log.timestamp).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      createdAt: moment(log.createdAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      updatedAt: moment(log.updatedAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }));

    res.status(200).json({
      currentPage: page,
      totalItems: await Log.countDocuments({ userEmail: email }),
      totalPages: Math.ceil(await Log.countDocuments({ userEmail: email }) / limit),
      logs: formattedLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs pour cet utilisateur' });
  }
};


const getLogsByFeature = async (req, res) => {
  if (!(await isAdmin(req.headers.authorization))) {
    return res.status(403).json({ message: 'Access denied, insufficient permissions' });
  }

  try {
    const { feature } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let logsQuery = Log.find({ feature }).sort({ timestamp: -1 });
    const logs = await paginate(logsQuery, page, limit);

    const formattedLogs = logs.map((log) => ({
      ...log._doc,
      timestamp: moment(log.timestamp).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      createdAt: moment(log.createdAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      updatedAt: moment(log.updatedAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    }));

    res.status(200).json({
      currentPage: page,
      totalItems: await Log.countDocuments({ feature }),
      totalPages: Math.ceil(await Log.countDocuments({ feature }) / limit),
      logs: formattedLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des logs pour cette fonctionnalité' });
  }
};

module.exports = { getAllLogs, getLogsByUserEmail, getLogsByFeature };
