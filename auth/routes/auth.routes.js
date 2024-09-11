const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/authcreate');
const { deleteUser } = require('../controllers/authDeleteUser');
const { getUsersByRole } = require('../controllers/authGetUser');
const { updateUser } = require('../controllers/authUpdateUser');
const { loginUser } = require('../controllers/authLoginUser');

router.post('/auth/create', createUser); // enpoint para crear usuarios de autenticacion.
router.delete('/auth/Delete', deleteUser); // enpoint para eliminar de la db el usuario.
router.get('/auth/GetUsersRol', getUsersByRole); // enpoint para mostrar los usuarios segun el rol especifico.
router.post('/auth/UpdateUser', updateUser); // endpoint para actualizar datos del usuario en la base de datos.
router.post('/auth/loginUser',loginUser) // enpoint para login de usuarios

module.exports = router;