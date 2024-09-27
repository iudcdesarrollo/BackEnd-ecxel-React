require('dotenv').config();
const app = require('./app');
const backupDB = require('./src/config/DB/backupDB');

const PORT = process.env.PORT;

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto ${PORT}`);
            const interval = 24 * 60 * 60 * 1000;
            setInterval(backupDB, interval);
        });
    } catch (error) {
        console.error(`Error al inicializar el servidor: ${error.message}`);
        process.exit(1);
    }
}

startServer();