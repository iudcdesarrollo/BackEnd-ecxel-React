const { DatosPersonales, Carrera } = require('../models/ModelDBWhatsappLedasCallCenter');
const { v4: uuidv4 } = require('uuid');

const updateClient = async (req, res) => {
    try {
        const { id, nombres, apellidos, correo, carrera } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'El ID del cliente es requerido' });
        }

        let cliente = await DatosPersonales.findOne({ where: { id: id } });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        let carreraEncontrada = await Carrera.findOne({ where: { nombre: carrera } });
        
        if (!carreraEncontrada) {
            carreraEncontrada = await Carrera.create({
                id: uuidv4(),
                nombre: carrera
            });
            console.log('Carrera creada:', carreraEncontrada.id);
        }

        cliente.nombres = nombres || cliente.nombres;
        cliente.apellidos = apellidos || cliente.apellidos;
        cliente.correo = correo || cliente.correo;
        cliente.carrera_id = carreraEncontrada.id;

        await cliente.save();

        return res.status(200).json({ message: 'Cliente actualizado con éxito', cliente });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

module.exports = updateClient;