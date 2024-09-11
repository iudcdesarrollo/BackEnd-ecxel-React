require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, Role, UserRole } = require('../../models/ModelDBWhatsappLedasCallCenter');
const secret = process.env.JWT_SECRET;

const updateUser = async (req, res) => {
  const { userId, username, password, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (username) {
      const existingUserByUsername = await User.findOne({ where: { username } });
      if (existingUserByUsername && existingUserByUsername.id !== userId) {
        return res.status(400).json({ message: 'El nombre de usuario ya existe' });
      }
      user.username = username;
    }

    if (email) {
      const existingUserByEmail = await User.findOne({ where: { email } });
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password_hash = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  updateUser
};