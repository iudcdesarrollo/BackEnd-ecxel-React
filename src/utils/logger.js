const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');
const successLogDirectory = path.join(logDirectory, 'success');
const errorLogDirectory = path.join(logDirectory, 'error');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

if (!fs.existsSync(successLogDirectory)) {
    fs.mkdirSync(successLogDirectory);
}

if (!fs.existsSync(errorLogDirectory)) {
    fs.mkdirSync(errorLogDirectory);
}

const getCurrentDateString = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

let lastLoggedDate = getCurrentDateString();

const logToFile = (message, isError) => {
    const currentDate = getCurrentDateString();
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    const separator = '-------------------------------------------------------------\n';

    const logFileName = isError ? `error-${currentDate}.log` : `success-${currentDate}.log`;
    const logFilePath = path.join(isError ? errorLogDirectory : successLogDirectory, logFileName);

    if (currentDate !== lastLoggedDate) {
        lastLoggedDate = currentDate;
    }

    fs.appendFileSync(logFilePath, separator + logMessage, (err) => {
        if (err) throw err;
    });
}

module.exports = logToFile;