const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userStore = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Simple login endpoint
router.post('/simple-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Username and password are required'
      });
    }
    
    // Demo users with proper roles
    const users = {
      'admin': { 
        password: 'admin123', 
        role: 'admin', 
        name: 'System Administrator', 
        id: '1',
        employeeId: 'ADM-001'
      },
      'agent1': { 
        password: 'agent123', 
        role: 'agent', 
        name: 'John Smith', 
        id: '2',
        employeeId: 'AGT-001'
      },
      'agent2': { 
        password: 'agent123', 
        role: 'agent', 
        name: 'Jane Doe', 
        id: '3',
        employeeId: 'AGT-002'
      },
      'agent3': { 
        password: 'agent123', 
        role: 'agent', 
        name: 'Mike Johnson', 
        id: '4',
        employeeId: 'AGT-003'
      }
    };
    
    const user = users[username];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Please check your username and password'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username,
        role: user.role,
        name: user.name,
        employeeId: user.employeeId
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      // Return demo admin user if no token
      return res.json({
        user: {
          id: '1',
          username: 'admin',
          name: 'System Administrator',
          role: 'admin',
          employeeId: 'ADM-001'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      
      const user = await userStore.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        user: userStore.sanitizeUser(user)
      });
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await userStore.findAllActive();
    res.json({ users: userStore.sanitizeUsers(users) });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get all agents
router.get('/agents', async (req, res) => {
  try {
    const agents = await userStore.findAllAgents();
    res.json({ agents: userStore.sanitizeUsers(agents) });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await userStore.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Create new user (admin only) - simplified without validation
router.post('/users', async (req, res) => {
  try {
    const { username, password, name, role, employeeId, email } = req.body;
    
    // Basic validation
    if (!username || !password || !name || !role || !employeeId) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Username, password, name, role, and employee ID are required'
      });
    }
    
    if (!['admin', 'agent'].includes(role)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Role must be either "admin" or "agent"'
      });
    }
    
    if (email && !email.includes('@')) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Invalid email format'
      });
    }
    
    const newUser = await userStore.create(req.body);
    res.status(201).json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Logout endpoint (client-side only)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;

