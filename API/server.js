const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logMiddleware = require('./middleware/logMiddleware');
const authRoutes = require('./routes/authRoutes');
const toolRoutes = require('./routes/toolRoutes');
const logRoutes = require('./routes/logRoutes');
const loginRoutes = require('./routes/loginRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');
const path = require('path');

dotenv.config();
const app = express();

app.use('/generated', express.static(path.join(__dirname, 'output')));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  swaggerOptions: {
    persistAuthorization: true,
    requestInterceptor: (req) => {
      console.log('Requête interceptée :');
      console.log('URL :', req.url);
      console.log('Headers avant modification :', req.headers);

      if (!req.url.includes('/login') && !req.url.includes('/register')) {
        if (jwtToken) {
          req.headers.Authorization = `Bearer ${jwtToken}`;
          console.log('Token injecté dans l\'en-tête :', req.headers.Authorization);
        } else {
          console.log('Aucun token disponible pour injection.');
        }
      } else {
        console.log(`Pas de token requis pour ${req.url}`);
      }

      console.log('Headers après modification :', req.headers);
      return req;
    },
    responseInterceptor: (res) => {    
      try {
        let responseBody;
    

        if (typeof res.body === 'string') {
          responseBody = JSON.parse(res.body); 
        } else {
          responseBody = res.body; 
        }
    

        if (
          (res.url.includes('/register') || res.url.includes('/login')) &&
          responseBody.token
        ) {
          jwtToken = responseBody.token; 
          console.log('Token capturé :', jwtToken);
        }
      } catch (err) {
        console.error('Erreur lors de l\'analyse de la réponse :', err);
      }
    
      return res; 
    }
    
  },
}));





mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(logMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/logs', logRoutes)
app.use('/api/logins', loginRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
