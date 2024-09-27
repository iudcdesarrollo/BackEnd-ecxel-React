const codeInjectionPrevention = (req, res, next) => {
    const patterns = [
        /<script.*?>.*?<\/script>/gi,
        /SELECT\s.*\sFROM\s.*\sWHERE\s/gi,
        /INSERT\sINTO\s.*\sVALUES\s.*\s/gi,
        /UPDATE\s.*\sSET\s.*\sWHERE\s/gi,
        /DELETE\sFROM\s.*\sWHERE\s/gi,
        /<iframe.*?>.*?<\/iframe>/gi,
        /<img.*?src=.*?javascript:.*?>/gi,
        /(?:'|\b)(?:union|select|insert|update|OR|delete|drop|truncate|create|alter|exec|call|declare|show)\b/gi,
        /<\s*script.*?>.*?<\s*\/\s*script>/gi,
        /javascript:[\s\S]*?;/gi,
        /eval\([\s\S]*?\)/gi,
        /(?:union|select|insert|update|delete|OR|drop|truncate|create|alter|exec|call|declare|show)\s+.*?;/gi
    ];

    const combinedPattern = new RegExp(patterns.map(p => p.source).join('|'), 'gi');

    const checkForInjection = (data, type) => {
        for (const key in data) {
            if (typeof data[key] === 'string' && combinedPattern.test(data[key])) {
                console.log(`Inyección de código detectada en ${type}:`, data[key]);
                return true;
            }
        }
        return false;
    };

    if (checkForInjection(req.body, 'cuerpo de la solicitud')) {
        console.log('Inyección de código detectada en el cuerpo de la solicitud');
        return res.status(400).json({ error: 'Inyeccion de codigo detectada intentalo en otro servidor 😒😒' });
    }

    if (checkForInjection(req.query, 'parámetros de consulta')) {
        console.log('Inyección de código detectada en parámetros de consulta');
        return res.status(400).json({ error: 'Inyeccion de codigo detectada intentalo en otro servidor 😒😒' });
    }

    if (checkForInjection(req.params, 'parámetros de ruta')) {
        console.log('Inyección de código detectada en parámetros de ruta');
        return res.status(400).json({ error: 'Inyeccion de codigo detectada intentalo en otro servidor 😒😒' });
    }
    
    if (checkForInjection(req.headers, 'cabeceras')) {
        console.log('Inyección de código detectada en las cabeceras');
        return res.status(400).json({ error: 'Inyeccion de codigo detectada intentalo en otro servidor 😒😒' });
    }

    next();
};

module.exports = codeInjectionPrevention;