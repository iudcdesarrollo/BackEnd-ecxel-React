/**
 * The `escapeRegExp` function escapes special characters in a string to prevent them from being
 * interpreted as regular expression metacharacters.
 * @param string - The `escapeRegExp` function takes a string as input and escapes special characters
 * that have special meanings in regular expressions.
 * @returns The `escapeRegExp` function returns a new string with any special characters escaped using
 * a backslash.
 */
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * The function `replacePostgraduateDegrees` takes a response and a set of replacements, processes the
 * response by replacing occurrences of the original values with the corresponding replacements, and
 * returns the modified response.
 * @param response - The `replacePostgraduateDegrees` function takes two parameters:
 * @param reemplazos - The `reemplazos` parameter in the `replacePostgraduateDegrees` function is an
 * object that contains key-value pairs where the key is the original postgraduate degree and the value
 * is the replacement for that degree. For example:
 * @returns The function `replacePostgraduateDegrees` takes in a `response` and a `reemplazos` object
 * as parameters. It processes the `response` by replacing occurrences of keys in the `reemplazos`
 * object with their corresponding values. It uses a regular expression to perform the replacements
 * globally in the `response`. Finally, it returns the processed `response` after all replacements have
 * been
 */
const  replacePostgraduateDegrees = (response, reemplazos) => {
    let preguntaProcesada = response;
    for (const [original, reemplazo] of Object.entries(reemplazos)) {
        const regex = new RegExp(escapeRegExp(original), "g");
        preguntaProcesada = preguntaProcesada.replace(regex, reemplazo);
    }
    return preguntaProcesada;
};

module.exports = replacePostgraduateDegrees;