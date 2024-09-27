const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const dateInfo = new Date(utc_value * 1000);
    const fractionalDay = serial - Math.floor(serial) + 0.0000001;
    const time = 86400000 * fractionalDay;
    return new Date(dateInfo.getTime() + time);
};

module.exports = excelDateToJSDate;