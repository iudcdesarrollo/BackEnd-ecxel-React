require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authMiddleware = require('./src/middleware/AuthMidelware');
const preventionOfDenialOfService = require('./src/middleware/DoS')
const codeInjectionPrevention = require('./src/middleware/codeInjectionPrevention');
const loggerMiddleware = require('./src/middleware/logs/loggerMiddleware');

const corsOptions = {
    origin: process.env.ENPOINT_FRONT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
//app.use(codeInjectionPrevention);
//app.use(loggerMiddleware);
preventionOfDenialOfService(app);
//app.use(authMiddleware);

const uploadRoutes = require('./src/routes/uploadsRoutes');
app.use('/api', uploadRoutes);

module.exports = app;