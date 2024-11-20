const axios = require('axios');


/**
 * The function `enviarMensajeHttpPost` sends a POST request with a payload containing client
 * information and a customized message to a specified endpoint.
 * @param IdClientDBB - The `IdClientDBB` parameter is likely an identifier for the client in a
 * database or system. It is used to uniquely identify the client to whom the message will be sent.
 * @param numero - The `numero` parameter in the `enviarMensajeHttpPost` function represents the phone
 * number to which the message will be sent. It is a required parameter for sending the message.
 * @param nombre - The `nombre` parameter in the `enviarMensajeHttpPost` function represents the name
 * of the recipient to whom the message will be sent. It is a string value that should contain the name
 * of the person receiving the message.
 * @param interes - The `interes` parameter in the `enviarMensajeHttpPost` function seems to represent
 * the interest or topic related to the message being sent. It is included in the payload object along
 * with other details such as the client ID, phone number, name, and a personalized message template.
 * @param mensajePersonalizado - The `mensajePersonalizado` parameter in the `enviarMensajeHttpPost`
 * function represents a custom message template that you want to send along with the other details
 * like `IdClientDBB`, `numero`, `nombre`, and `interes`. This template could be a personalized message
 * that you want to
 * @returns The function `enviarMensajeHttpPost` is returning the data received from the HTTP POST
 * request made to the specified endpoint. If the request is successful (status code 200), it returns
 * the response data. If there is an error during the request, it logs the error and throws it.
 */
const enviarMensajeHttpPost = async (IdClientDBB, numero, nombre, interes, templateNammee) => {
    const payload = {
        id: IdClientDBB,
        number: numero,
        templateName: templateNammee,
        names: nombre,
        interest: interes
    };

    console.log(payload.id, payload.number, payload.templateName,payload.interest
    );

    const url = process.env.ENPOINT;

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error('Error en la solicitud HTTP: ' + response.statusText);
        }

        return response.data;

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
};

module.exports = enviarMensajeHttpPost;