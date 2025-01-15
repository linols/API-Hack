const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const promoteUserToAdminByEmail = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
    }


    const token = authHeader.split(' ')[1];


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas administrateur' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const userToPromote = await User.findOne({ email });

    if (!userToPromote) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

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


const setPermissionsForUser = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
      }
  
      const token = authHeader.split(' ')[1];
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: 'Token invalide' });
      }
  
      const currentUser = await User.findById(decoded.id).select('-password');
  
      if (!currentUser) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
  
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas administrateur' });
      }
  
      const { email, permissions } = req.body;
  
      if (!email || !Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Email et permissions sont requis' });
      }
  
      const userToUpdate = await User.findOne({ email });
  
      if (!userToUpdate) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
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
  
