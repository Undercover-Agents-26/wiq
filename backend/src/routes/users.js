
const express = require('express');
const router = express.Router();
const userStore = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');
const { NotFoundError } = require('../middleware/errorHandler');

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const users = await userStore.findAllActive();
    const sanitizedUsers = userStore.sanitizeUsers(users);
    res.json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const user = await userStore.findById(req.params.id);
    
    if (!user || user.isActive === false) {
      throw new NotFoundError('User');
    }
    
    // Users can only see their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      throw new NotFoundError('User');
    }
    
    res.json(userStore.sanitizeUser(user));
  } catch (error) {
    next(error);
  }
});

// Create new user (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), 
  validate(validationRules.createUser), 
  async (req, res, next) => {
    try {
      const user = await userStore.create(req.body);
      res.status(201).json(userStore.sanitizeUser(user));
    } catch (error) {
      next(error);
    }
});

// Update user
router.put('/:id', authenticateToken, 
  validate(validationRules.createUser.filter(rule => rule.optional())), 
  async (req, res, next) => {
    try {
      const user = await userStore.findById(req.params.id);
      
      if (!user || user.isActive === false) {
        throw new NotFoundError('User');
      }
      
      // Users can only update their own profile unless they're admin
      if (req.user.role !== 'admin' && req.user.id !== user.id) {
        throw new NotFoundError('User');
      }
      
      const updatedUser = await userStore.update(req.params.id, req.body);
      res.json(userStore.sanitizeUser(updatedUser));
    } catch (error) {
      next(error);
    }
});

// Deactivate user (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const user = await userStore.findById(req.params.id);
    
    if (!user) {
      throw new NotFoundError('User');
    }
    
    await userStore.deactivate(req.params.id);
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user statistics (Admin only)
router.get('/stats/summary', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const stats = await userStore.getStatistics();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;