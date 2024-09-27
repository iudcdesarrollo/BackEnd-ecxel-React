const fs = require('fs');
const path = require('path');
const { Estado, Carrera, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');

/**
 * The function `insertDataFromJson` reads data from a JSON file, checks for duplicates in a database,
 * and inserts new records if they do not already exist.
 * @param jsonFilePath - The `jsonFilePath` parameter in the `insertDataFromJson` function is the file
 * path to the JSON file from which you want to insert data into the database. This function reads the
 * JSON file, parses its contents, and then iterates over the records to insert them into the database
 * if they
 */
const insertDataFromJson = async (jsonFilePath) => {
    try {
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        for (const record of data) {
            const carrera = await Carrera.findOne({ where: { nombre: record.carrera } });
            const estado = await Estado.findOne({ where: { nombre: record.estado } });

            const existingRecord = await DatosPersonales.findOne({
                where: {
                    nombres: record.nombres,
                    apellidos: record.apellidos,
                    telefono: record.telefono,
                    carrera_id: carrera.id,
                    estado_id: estado.id
                }
            });

            if (!existingRecord) {
                try {
                    await DatosPersonales.create({
                        id: record.id,
                        fecha_ingreso_meta: record.fecha_ingreso_meta,
                        nombres: record.nombres,
                        apellidos: record.apellidos,
                        correo: record.correo,
                        telefono: record.telefono,
                        carrera_id: carrera.id,
                        estado_id: estado.id,
                        enviado: record.enviado || false,
                        fecha_envio_wha: record.fecha_envio_what || '2000-01-01 00:00:00'
                    });
                    console.log('Nuevo registro creado:', record);
                } catch (insertError) {
                    console.error('Error al insertar datos en la base de datos:', insertError);
                }
            } else {
                //console.log(`Registro duplicado encontrado: ${record.nombres} ${record.apellidos}`);
            }
        }
    } catch (error) {
        throw new Error('Error al insertar datos desde el JSON: ' + error.message);
    }
};

module.exports = insertDataFromJson;