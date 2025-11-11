const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const authMiddleware = async (req, res, next) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }


    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;