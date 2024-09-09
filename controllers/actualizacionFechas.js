const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');

function formatDateToCustomISO(date) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

async function updateDateFormats() {
    try {
        // Obtén todos los registros
        const registros = await DatosPersonales.findAll();

        for (const registro of registros) {
            // Asegúrate de que el objeto 'registro' contenga las fechas en formato de fecha de JavaScript
            const fechaIngresoMeta = registro.fecha_ingreso_meta ? new Date(registro.fecha_ingreso_meta) : null;
            const fechaEnvioWha = registro.fecha_envio_wha ? new Date(registro.fecha_envio_wha) : null;

            // Convierte las fechas al formato personalizado
            const nuevaFechaIngresoMeta = formatDateToCustomISO(fechaIngresoMeta);
            const nuevaFechaEnvioWha = formatDateToCustomISO(fechaEnvioWha);

            // Imprime las fechas originales y las nuevas fechas para verificar
            console.log('Fecha original ingreso meta:', registro.fecha_ingreso_meta);
            console.log('Fecha nueva ingreso meta:', nuevaFechaIngresoMeta);
            console.log('Fecha original envio wha:', registro.fecha_envio_wha);
            console.log('Fecha nueva envio wha:', nuevaFechaEnvioWha);

            // Actualiza el registro con el nuevo formato
            await registro.update({
                fecha_ingreso_meta: nuevaFechaIngresoMeta,
                fecha_envio_wha: nuevaFechaEnvioWha
            });

            // Verifica la actualización
            const updatedRegistro = await DatosPersonales.findByPk(registro.id);
            console.log('Fecha actualizada ingreso meta:', updatedRegistro.fecha_ingreso_meta);
            console.log('Fecha actualizada envio wha:', updatedRegistro.fecha_envio_wha);
        }

        console.log('Fechas actualizadas correctamente.');
    } catch (error) {
        console.error('Error al actualizar fechas:', error);
    }
}

// Llama a la función para actualizar las fechas
updateDateFormats();