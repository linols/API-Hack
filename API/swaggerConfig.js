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
        name: 'Auth',
        description: 'Authentication and registration',
      },
      {
        name: 'Users', 
        description: 'User management and permissions',
      },
    ],
    servers: [
      {
        url: 'http://31.207.34.16:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
