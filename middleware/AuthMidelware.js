require('dotenv').config();
const AUTH_KEY = process.env.AUTH_KEY;

const authMiddleware = (req, res, next) => {
  const key = req.headers['authorization'];

  if (key === AUTH_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'No estas Autorizado para entrar a mi server 🥴🥴😵' });
  }
};

module.exports = authMiddleware;