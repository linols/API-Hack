const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Exemple d'une fonction qui vérifie l'existence d'un email
const checkEmailExistence = async (req, res) => {
  // Vérification du JWT manuelle dans chaque contrôleur
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Vérifier si l'utilisateur a la permission requise pour cette fonctionnalité
    if (!user.permissions.includes('check_email')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    // Si l'utilisateur est valide et a la permission, continuer le traitement
    const { email } = req.body;

    // Simuler une vérification d'email (ici vous pouvez utiliser une API tierce)
    const emailExists = email === 'example@example.com'; // Simule une existence d'email
    res.json({ emailExists });
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Exemple de génération d'un mot de passe sécurisé
const generateSecurePassword = async (req, res) => {
  // Vérification du JWT manuelle dans chaque contrôleur
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Vérifier si l'utilisateur a la permission requise pour cette fonctionnalité
    if (!user.permissions.includes('generate_password')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    // Si l'utilisateur est valide et a la permission, continuer le traitement
    const length = req.body.length || 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    res.json({ password });
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = { checkEmailExistence, generateSecurePassword };
