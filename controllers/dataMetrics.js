const { DatosPersonales, Estado, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');

const getLast30Days = () => {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - 30));
};

const getLast7Days = () => {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - 7));
};

const getPersonsStatusCounts = async (req, res) => {
  const { servicioNombre } = req.query;
  const excludedPhones = [
    '573136368783',
    '573142332746',
    '573137631781',
    '573118594657',
    '573224436731'
  ];

  try {
    const now = new Date();
    const last30Days = getLast30Days();
    const last7Days = getLast7Days();

    const servicio = await Servicio.findOne({ where: { nombre: servicioNombre } });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const estadoInteresado = await Estado.findOne({ where: { nombre: 'Inscrito' } });
    const estadoGestionado = await Estado.findOne({ where: { nombre: 'Gestionado' } });

    const totalPersonas = await DatosPersonales.count({
      where: {
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countInteresados = await DatosPersonales.count({
      where: {
        estado_id: estadoInteresado.id,
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countGestionados = await DatosPersonales.count({
      where: {
        estado_id: estadoGestionado.id,
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countSinGestionar = await DatosPersonales.count({
      where: {
        estado_id: { [Op.ne]: estadoGestionado.id },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const totalLast30Days = await DatosPersonales.count({
      where: {
        fecha_envio_wha: { [Op.between]: [last30Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countInteresadosLast30Days = await DatosPersonales.count({
      where: {
        estado_id: estadoInteresado.id,
        fecha_envio_wha: { [Op.between]: [last30Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countGestionadosLast30Days = await DatosPersonales.count({
      where: {
        estado_id: estadoGestionado.id,
        fecha_envio_wha: { [Op.between]: [last30Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countSinGestionarLast30Days = await DatosPersonales.count({
      where: {
        estado_id: { [Op.ne]: estadoGestionado.id },
        fecha_envio_wha: { [Op.between]: [last30Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const totalLast7Days = await DatosPersonales.count({
      where: {
        fecha_envio_wha: { [Op.between]: [last7Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countInteresadosLast7Days = await DatosPersonales.count({
      where: {
        estado_id: estadoInteresado.id,
        fecha_envio_wha: { [Op.between]: [last7Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countGestionadosLast7Days = await DatosPersonales.count({
      where: {
        estado_id: estadoGestionado.id,
        fecha_envio_wha: { [Op.between]: [last7Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    const countSinGestionarLast7Days = await DatosPersonales.count({
      where: {
        estado_id: { [Op.ne]: estadoGestionado.id },
        fecha_envio_wha: { [Op.between]: [last7Days, now] },
        servicio_id: servicio.id,
        telefono: { [Op.notIn]: excludedPhones }
      }
    });

    res.json({
      totalPersonas,
      countInteresados,
      countGestionados,
      countSinGestionar,
      totalLast30Days,
      countInteresadosLast30Days,
      countGestionadosLast30Days,
      countSinGestionarLast30Days,
      totalLast7Days,
      countInteresadosLast7Days,
      countGestionadosLast7Days,
      countSinGestionarLast7Days
    });
    
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

module.exports = getPersonsStatusCounts;