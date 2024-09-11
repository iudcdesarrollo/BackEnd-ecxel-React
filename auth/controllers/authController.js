require('dotenv').config();
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const secret = process.env.JWT_SECRET;

const authenticateUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.encode({ id: user.id, role: user.role }, secret);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = jwt.decode(token, secret);

      if (roles.includes(decoded.role)) {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

module.exports = {
  authenticateUser,
  authorize,
};