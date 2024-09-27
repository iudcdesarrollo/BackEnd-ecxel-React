const allowedFileExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.pdf', 
    '.xls', '.xlsx',
    '.doc', '.docx'
];

const blockFileTypes = (req, res, next) => {
    if (req.file) {
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        
        if (!allowedFileExtensions.includes(`.${fileExtension}`)) {
            return res.status(400).json({ message: 'El tipo de archivo el cual intentas ingresar al servidor no esta permitido.' });
        }
    }
    
    if (req.files) {
        for (const file of req.files) {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            
            if (!allowedFileExtensions.includes(`.${fileExtension}`)) {
                return res.status(400).json({ message: 'Tipo de archivo no permitido.' });
            }
        }
    }
    
    next();
};

module.exports = blockFileTypes;