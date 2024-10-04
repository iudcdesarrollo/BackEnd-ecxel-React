/**
 * The function "mensajeAEnviar" generates a personalized message for a prospective student interested
 * in a specific undergraduate program at a university in Colombia, providing details about the program
 * and inviting further inquiries.
 * @param nombre - The parameter `nombre` in the function `mensajeAEnviar` represents the first name of
 * the person to whom the message will be sent.
 * @param apellido - The `apellido` parameter in the `mensajeAEnviar` function represents the last name
 * of the person to whom the message will be sent. It is used to personalize the greeting in the
 * message by addressing the individual with their first name and last name.
 * @param pregrado - The `pregrado` parameter refers to the undergraduate program that the person is
 * interested in at the Universidad de Colombia.
 * @returns The function `mensajeAEnviar` returns a personalized message including the inputted
 * `nombre`, `apellido`, and `pregrado` values. The message provides information about the program of
 * interest at the Institución Universitaria de Colombia, the modalities in which the programs are
 * offered, and invites the recipient to inquire about more information if they are still interested.
 */
const mensajeAEnviar = (nombre, apellido, pregrado) => {

  const mensajePersonalizado = `¡Hola, ${nombre} ${apellido}!
  
  Cordial saludo. Hemos notado que estás interesad@ en el programa ${pregrado} de la Institución Universitaria de Colombia. 🇨🇴
  
  Te recordamos que nuestros programas se imparten en modalidad 100% presencial en Bogotá. 📚 Ofrecemos horarios flexibles pensando en ti ☺:
  
  ⏱ Diurno: Lunes a viernes, de 8:00 am a 12:00 pm
  ⏱ Nocturno: Lunes a viernes, de 6:00 pm a 10:00 pm
  ⏱ Fines de Semana: Viernes, sábado y domingo (Aplica para algunas carreras profesionales)
  
  ‼ ¿Sigues interesado? Cuéntanos, ¿qué información deseas conocer?⁉`;

  return mensajePersonalizado

}

module.exports = mensajeAEnviar;