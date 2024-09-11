require('dotenv').config();
const { User, Role, UserRole } = require('../../models/ModelDBWhatsappLedasCallCenter');

const getUsersByRole = async (req, res) => {
  const { roleName } = req.body;

  try {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    const users = await User.findAll({
      attributes: ['username', 'email'],
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['name'],
          where: { name: roleName }
        }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con el rol especificado' });
    }

    const userInfo = users.map(user => ({
      username: user.username,
      email: user.email,
      role: roleName
    }));

    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  getUsersByRole
};