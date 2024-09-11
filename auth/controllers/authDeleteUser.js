require('dotenv').config();
const { User, UserRole } = require('../../models/ModelDBWhatsappLedasCallCenter');

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  console.log(userId);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await UserRole.destroy({ where: { user_id: userId } });

    await user.destroy();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

module.exports = {
  deleteUser
};