const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/authcreate');

router.post('/auth/create', createUser); // enpoint para crear usuarios de autenticacion...

module.exports = router;