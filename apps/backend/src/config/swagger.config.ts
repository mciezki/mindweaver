import swaggerJsdoc from 'swagger-jsdoc';

import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MindWeave API Docs',
      version: version,
      description: 'REST API Doc',
      contact: {
        name: 'MindWeave Support',
        email: '-',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Localhost',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.swagger.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
