require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT;

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto ${PORT}`);
        });
    } catch (error) {
        console.error(`Error al inicializar el servidor: ${error.message}`);
        process.exit(1);
    }
}

startServer();