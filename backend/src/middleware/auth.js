const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, continue without user
      console.warn('Invalid token:', error.message);
    }
  }
  
  // For demo purposes, if no token, set a demo user
  if (!req.user) {
    req.user = {
      id: '1',
      username: 'admin',
      name: 'System Administrator',
      role: 'admin',
      employeeId: 'ADM-001'
    };
  }
  
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireAgent = (req, res, next) => {
  if (!req.user || (req.user.role !== 'agent' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Agent or admin access required' });
  }
  next();
};

module.exports = {
  JWT_SECRET,
  optionalAuth,
  requireAuth,
  requireAdmin,
  requireAgent
};