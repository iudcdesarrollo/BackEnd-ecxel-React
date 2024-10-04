/**
 * The function `validacionNumber` manipulates a given number by removing the first digit if it is '1'
 * and adding '57' at the beginning if the number starts with '3' and does not contain '57'.
 * @param numero - The `validacionNumber` function takes a number as input and performs some validation
 * checks on it.
 * @returns The function `validacionNumber` takes a number as input, converts it to a string, and then
 * performs some checks and modifications on the string based on certain conditions. The modified
 * string is then returned as the output.
 */
const validacionNumber = (numero) => {
    let number = numero.toString();

    if (number.startsWith('1')) {
        number = number.slice(1);
    }

    if (number.startsWith('+')) {
        number = number.slice(1);
    }

    if (number.startsWith('3') && !number.includes('57')) {
        number = '57' + number;
    }

    return number;
};

module.exports = validacionNumber;