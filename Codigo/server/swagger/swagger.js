import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import components from "./components.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Codigo API",
            version: "1.0.0",
        },
        components: components
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
