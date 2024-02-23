import swaggerJSDOC from 'swagger-jsdoc';
import { __dirname } from '../utils.js';

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ECCOMERCE CODER Entrega 13",
            version: "1.0.0",
            description: "API de ECCOMERCE CODER Entrega 13",
        },
    },
    apis: [`${__dirname}/docs/*.yaml`],
}

export const swaggerSetup = swaggerJSDOC(swaggerOptions);