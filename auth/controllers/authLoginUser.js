const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../../models/ModelDBWhatsappLedasCallCenter');
const secret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        through: { attributes: [] },
        attributes: ['name']
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const userRole = user.Roles.length > 0 ? user.Roles[0].name : 'No Role Assigned';

    const token = jwt.sign({ id: user.id, username: user.username, role: userRole }, secret, { expiresIn: '1h' });

    res.status(200).json({ token, role: userRole, message: 'Autenticación exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  loginUser
};