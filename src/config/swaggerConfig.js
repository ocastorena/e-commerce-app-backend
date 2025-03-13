const swaggerJsdoc = require("swagger-jsdoc");

// swagger definition
const swaggerDefinition = {
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "API documentation",
  },
  host: "localhost:3000",
  basePath: "/",
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
