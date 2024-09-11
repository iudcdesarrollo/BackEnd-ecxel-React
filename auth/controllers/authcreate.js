require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { User, Role, UserRole } = require('../../models/ModelDBWhatsappLedasCallCenter');
const secret = process.env.JWT_SECRET;

const allowedRoles = [ // estos son los roles permitidos para la creacion de usuarios
  'InnovacionAdmin',
  'adminCallCenter',
  'AgenteCallCenter',
  'IPSCallCenter',
  'VeterinariaCallCenter'
];

const createUser = async (req, res) => {
  const { username, password, email, roleName } = req.body;

  try {
    if (!allowedRoles.includes(roleName)) {
      return res.status(400).json({ message: 'El rol especificado no está permitido' });
    }

    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(400).json({ message: 'El rol especificado no existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      email
    });

    await UserRole.create({
      user_id: newUser.id,
      role_id: role.id
    });

    const token = jwt.encode({ id: newUser.id, role: role.name }, secret);

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  createUser
};