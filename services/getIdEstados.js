const { Estado } = require('../models/ModelDBWhatsappLedasCallCenter.js');

const getEstadoIdByName = async (estadoNombre) => {
  try {
    const estado = await Estado.findOne({ where: { nombre: estadoNombre } });
    if (estado) {
      return estado.id;
    } else {
      throw new Error(`Estado con nombre "${estadoNombre}" no encontrado`);
    }
  } catch (error) {
    console.error('Error al obtener el ID del estado:', error.message);
    throw error;
  }
};

module.exports = getEstadoIdByName;