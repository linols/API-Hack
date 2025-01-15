const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for user management, including authentication, promotion, and permissions.',
    },
    tags: [
      {
        name: 'Auth', // Nom du tag
        description: 'Authentication and registration',
      },
      {
        name: 'Users', // Nom du tag
        description: 'User management and permissions',
      },
    ],
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ajoutez vos fichiers de routes ici
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
