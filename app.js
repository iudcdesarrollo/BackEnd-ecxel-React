require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authMiddleware = require('./middleware/AuthMidelware');
const preventionOfDenialOfService = require('./middleware/DoS')
const codeInjectionPrevention = require('./middleware/codeInjectionPrevention');

const corsOptions = {
    origin: process.env.ENPOINT_FRONT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
//app.use(codeInjectionPrevention);
preventionOfDenialOfService(app);
app.use(authMiddleware);

const uploadRoutes = require('./routes/uploadsRoutes');
const authRoutes = require('./auth/routes/auth.routes');

app.use('/api', uploadRoutes);
app.use('/api', authRoutes);

module.exports = app;