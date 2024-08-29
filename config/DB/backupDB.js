require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const obtenerFechaActual = require('../../utils/obtenerFechaActual');

const backupDB = async () => {
    try {
        const dateStr = obtenerFechaActual().replace(/\s+/g, '-').replace(/:/g, '-');
        const backupFileName = `backup-${dateStr}.sql`;

        const backupFilePath = path.join(__dirname, backupFileName);

        const backupDir = path.dirname(backupFilePath);
        if (!fs.existsSync(backupDir)) {
            console.log(`Creando directorio: ${backupDir}`);
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;
        const dbName = process.env.DB_NAME;
        const host = process.env.DB_HOST;

        const connection = await mysql.createConnection({
            host,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        const tableOrder = ['carreras', 'estados', 'datos_personales'];

        let backupData = '';

        backupData += `CREATE DATABASE IF NOT EXISTS ${dbName};\n`;
        backupData += `USE ${dbName};\n\n`;

        for (const tableName of tableOrder) {
            const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
            backupData += `${createTable[0]['Create Table']};\n\n`;
        }

        for (const tableName of tableOrder) {
            const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);

            rows.forEach(row => {
                const values = Object.values(row).map(value => {
                    if (value === null) return 'NULL';
                    return `'${value.toString().replace(/'/g, "\\'")}'`;
                });
                backupData += `INSERT INTO \`${tableName}\` VALUES (${values.join(', ')});\n`;
            });

            backupData += '\n\n';
        }

        fs.writeFileSync(backupFilePath, backupData);

        await connection.end();

        return backupFilePath;
    } catch (error) {
        console.error(`Error al realizar el backup: ${error.message}`);
        throw error;
    }
};

const main = async () => {
    try {
        const filePath = await backupDB();
        console.log(`${filePath}`);
    } catch (error) {
        console.error(`Error al realizar el backup: ${error.message}`);
    }
};

main();