const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Contrôleur pour promouvoir un utilisateur en admin par email
const promoteUserToAdminByEmail = async (req, res) => {
  try {
    // Récupérer le token JWT à partir des en-têtes
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Récupérer l'utilisateur actuel (celui qui fait la requête) depuis le token
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur actuel est un admin
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas administrateur' });
    }

    // Récupérer l'email de l'utilisateur à promouvoir depuis le body de la requête
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Trouver l'utilisateur par son email
    const userToPromote = await User.findOne({ email });

    if (!userToPromote) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Promouvoir l'utilisateur en admin
    userToPromote.role = 'admin';
    const updatedUser = await userToPromote.save();

    res.status(200).json({
      message: `Utilisateur ${updatedUser.username} a été promu au statut d'administrateur`,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      }
    });
  } catch (error) {
    console.error('Erreur lors de la promotion de l\'utilisateur', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour définir les permissions d'un utilisateur par email
const setPermissionsForUser = async (req, res) => {
    try {
      // Récupérer le token JWT à partir des en-têtes
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
      }
  
      // Extraire le token
      const token = authHeader.split(' ')[1];
  
      // Vérifier le token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: 'Token invalide' });
      }
  
      // Récupérer l'utilisateur actuel (celui qui fait la requête) depuis le token
      const currentUser = await User.findById(decoded.id).select('-password');
  
      if (!currentUser) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Vérifier si l'utilisateur actuel est un admin
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas administrateur' });
      }
  
      // Récupérer l'email de l'utilisateur dont on veut définir les permissions et les permissions à attribuer
      const { email, permissions } = req.body;
  
      if (!email || !Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Email et permissions sont requis' });
      }
  
      // Trouver l'utilisateur par son email
      const userToUpdate = await User.findOne({ email });
  
      if (!userToUpdate) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Mettre à jour les permissions de l'utilisateur
      userToUpdate.permissions = permissions;
      const updatedUser = await userToUpdate.save();
  
      res.status(200).json({
        message: `Permissions de l'utilisateur ${updatedUser.username} mises à jour avec succès`,
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          permissions: updatedUser.permissions,
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions de l\'utilisateur', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  module.exports = {
    promoteUserToAdminByEmail,
    setPermissionsForUser,
  };
  
