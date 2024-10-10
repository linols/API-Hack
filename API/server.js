const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logMiddleware = require('./middleware/logMiddleware');
const authRoutes = require('./routes/authRoutes');
const toolRoutes = require('./routes/toolRoutes');
const logRoutes = require('./routes/logRoutes'); // Routes pour accéder aux logs

dotenv.config();

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware pour l'analyse du JSON
app.use(express.json());

// Middleware de logging
app.use(logMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/logs', logRoutes); // Ajouter les routes de logs

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
