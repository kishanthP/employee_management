const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Employee Management API',
    description: 'API documentation for the Employee Management System',
    version: '1.0.0',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token in the format **Bearer &lt;token&gt;**',
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger_output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
