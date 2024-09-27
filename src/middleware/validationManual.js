const { body, validationResult } = require('express-validator');

const validateManualCustomerEntry = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio.'),
    body('correo').isEmail().withMessage('El correo electrónico no es válido.'),
    body('telefono').matches(/^\+573\d{9}$/).withMessage('Número de teléfono colombiano inválido. Debe comenzar con +573 y tener 9 dígitos después del código de país.'),
    body('posgradoInteres').notEmpty().withMessage('El programa de interés es obligatorio.'),
    body('fechaIngresoMeta').isISO8601().withMessage('La fecha de ingreso debe estar en formato YYYY-MM-DD.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateManualCustomerEntry;