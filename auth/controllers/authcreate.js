require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { User } = require('../../models/ModelDBWhatsappLedasCallCenter');  // Cambia a 'User' en lugar de 'user'
const secret = process.env.JWT_SECRET;

const createUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    // Buscar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    // Encriptar contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear nuevo usuario
    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      email,
      role
    });

    // Generar token JWT
    const token = jwt.encode({ id: newUser.id, role: newUser.role }, secret);

    // Respuesta con el token y los datos del usuario
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  createUser
};