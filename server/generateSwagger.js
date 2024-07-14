// generateSwagger.js
import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();

const doc = {
  info: {
    title: 'Stock Trading Simulator API',
    description: 'A REST API for the Stock Trading Simulator',
    version: '0.0.0',
  },
  servers: [
    {
      url: 'http://0.0.0.0:3010',
    },
  ],
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/index.ts']; // Update this to point to your route files

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger docs generated');
});
