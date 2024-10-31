const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const axios = require('axios');
const generatePassword = require('generate-password');
const nodemailer = require('nodemailer');
const { faker } = require('@faker-js/faker');

let commonPasswords = new Set();

const loadCommonPasswords = async () => {
  try {
    const filePath = path.join(__dirname, '../data/10k-most-common.txt');
    const data = fs.readFileSync(filePath, 'utf-8');
    commonPasswords = new Set(data.split('\n').map(pwd => pwd.trim()));
    console.log('Liste des mots de passe communs chargée avec succès');
  } catch (error) {
    console.error('Erreur lors du chargement de la liste des mots de passe communs:', error);
  }
};

loadCommonPasswords();

const checkPasswordStrength = async (req, res) => {
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

    if (!user.permissions.includes('check_password_strength')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (commonPasswords.has(password)) {
      return res.json({ isCommon: true, message: 'The password is among the most commonly used passwords. Please choose a more secure password.' });
    } else {
      return res.json({ isCommon: false, message: 'The password is not among the most commonly used passwords.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const checkEmailExistence = async (req, res) => {
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

    if (!user.permissions.includes('check_email')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const apiKey = process.env.HUNTER_API_KEY;
    const hunterUrl = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {
      const response = await axios.get(hunterUrl);
      const { data } = response;
      if (data && data.data && data.data.status) {
        return res.json({ emailExists: data.data.status === 'valid' });
      } else {
        return res.status(500).json({ message: 'Error verifying email with Hunter.io' });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email via Hunter.io:', error);
      return res.status(500).json({ message: 'Failed to verify email with Hunter.io' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};



const generateSecurePassword = async (req, res) => {
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

    if (!user.permissions.includes('generate_password')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    const length = req.body.length || 16;

    // Génération du mot de passe avec la bibliothèque generate-password
    const password = generatePassword.generate({
      length: length,
      numbers: true,         
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true
    });

    res.json({ password });
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }

  
}

const sendEmailSpam = async (req, res) => {
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

    if (!user.permissions.includes('send_email_spam')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    const { email, subject, message, count } = req.body;

    if (!email || !subject || !message || !count) {
      return res.status(400).json({ message: 'Email, subject, message, and count are required' });
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    for (let i = 0; i < count; i++) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          text: message,
        });
      } catch (error) {
        console.error(`Erreur lors de l'envoi du mail numéro ${i + 1}:`, error);
        return res.status(500).json({ message: `Failed to send email number ${i + 1}` });
      }
    }

    res.status(200).json({ message: `Successfully sent ${count} emails to ${email}` });
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid', error : error.message});
  }
};


const getSubdomains = async (req, res) => {
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

    if (!user.permissions.includes('getSubdomains')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    let { domain } = req.body;
    domain = domain.replace(/^www\./i, ''); // Supprimer 'www.' au début du domaine
    if (!domain) {
      return res.status(400).json({ message: 'Domain is required' });
    }

    try {
      const apiKey = process.env.SECURITYTRAILS_API_KEY;
      const response = await axios.get(`https://api.securitytrails.com/v1/domain/${domain}/subdomains`, {
        headers: {
          'APIKEY': apiKey
        }
      });

      let subdomains = response.data.subdomains
        .filter(subdomain => subdomain.toLowerCase() !== 'www') // Exclusion de 'www'
        .map(subdomain => {
          // Supprimer toute occurrence supplémentaire de 'www.' dans les sous-domaines
          const cleanSubdomain = subdomain.replace(/^www\./i, '');
          return `${cleanSubdomain}.${domain}`;
        });

      res.status(200).json({ domain, subdomains });
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-domaines:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to retrieve subdomains' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }

  
};

const generateFakeIdentity = async (req, res) => {
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

    if (!user.permissions.includes('generateFakeIdentity')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    function generateFrenchPhoneNumber() {
      const prefix = Math.random() < 0.5 ? '+33 6' : '+33 7';
      const number = `${prefix} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`;
      return number;
    }


    const fakeIdentity = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phoneNumber: generateFrenchPhoneNumber(),
       address: {
         street: faker.location.streetAddress(),
         city: faker.location.city(),
         state: faker.location.state(),
         zipCode: faker.location.zipCode(),
         country: faker.location.country()
       },
      dateOfBirth: faker.date.past(70, new Date()).toLocaleDateString(),
      jobTitle: faker.person.jobTitle(),
      company: faker.company.name(),
    };


    res.json(fakeIdentity);
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const ddos = async (req, res) => {
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

    if (!user.permissions.includes('ddos')) {
      return res.status(403).json({ message: 'Access denied, insufficient permissions' });
    }

    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const requests = [];
    for (let i = 0; i < 20; i++) {
      requests.push(axios.get(url));
    }

    try {
      const responses = await Promise.all(requests);
      const statuses = responses.map((response, index) => ({
        requestNumber: index + 1,
        status: response.status,
      }));
      res.status(200).json({ message: 'Requests completed', statuses });
    } catch (error) {
      console.error('Erreur lors de l\'envoi des requêtes:', error.message);
      res.status(500).json({ message: 'Error in sending requests', error: error.message });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid', error: error.message });
  }
};




module.exports = { checkEmailExistence, generateSecurePassword, sendEmailSpam, checkPasswordStrength, getSubdomains, generateFakeIdentity, ddos};
