const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./Controllers");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./dump/swagger-docs.json');

const app = express();

app.set("PORT", process.env.PORT || 4001);
app.set("HOSTNAME", process.env.HOSTNAME || "localhost");

app.use(compression());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, false);
        const allowedOrigins = [];
        if (process.env.NODE_ENV === 'development') {
            allowedOrigins.push('http://localhost:5173');
            allowedOrigins.push('http://localhost:4000');
            allowedOrigins.push('http://localhost:4001');
            allowedOrigins.push('http://127.0.0.1:5173');
            allowedOrigins.push('http://127.0.0.1:4000');
            allowedOrigins.push('http://127.0.0.1:4001');
        }
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        callback(null, false);
    },
    credentials: true
}));
app.use(helmet());
app.use(express.json({limit: "2mb"}));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

module.exports = app;