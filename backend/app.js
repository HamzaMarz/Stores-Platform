const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
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
            allowedOrigins.push('http://localhost:5175');
            allowedOrigins.push('http://localhost:4000');
            allowedOrigins.push('http://localhost:4001');
            allowedOrigins.push('http://127.0.0.1:5173');
            allowedOrigins.push('http://127.0.0.1:5175');
            allowedOrigins.push('http://127.0.0.1:4000');
            allowedOrigins.push('http://127.0.0.1:4001');
        }
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        callback(null, false);
    },
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Stripe webhook needs raw body for signature verification
app.use('/api/v1/stripe/webhook', express.raw({type: '*/*'}));
app.use(express.json({limit: "2mb"}));
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles: false,
    createParentPath: true,
}));
app.use(cookieParser());
// Serve static assets from uploads for any non-API paths
const uploadsDir = path.join(__dirname, "uploads");
app.use(express.static(uploadsDir, { index: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

module.exports = app;