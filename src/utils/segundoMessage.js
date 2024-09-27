const obtenerFechaActual = require("./obtenerFechaActual");
const fs = require('fs').promises;
const path = require('path');

const segundoMessage = async (nuevoId, Phone_Number) => {
    const fechaActual = await obtenerFechaActual();
    
    const nuevoDato = {
        id: nuevoId,
        fecha: fechaActual,
        Phone_Number: Phone_Number
    };

    const filePath = path.join(__dirname, '../temp/SegundoMesage.json');

    try {
        const contenidoActual = await fs.readFile(filePath, 'utf-8');
        const datos = JSON.parse(contenidoActual);

        datos.push(nuevoDato);

        await fs.writeFile(filePath, JSON.stringify(datos, null, 2), 'utf-8');
        
    } catch (error) {
        const datos = [nuevoDato];
        await fs.writeFile(filePath, JSON.stringify(datos, null, 2), 'utf-8');
    }

    return nuevoDato;
};

module.exports = segundoMessage;