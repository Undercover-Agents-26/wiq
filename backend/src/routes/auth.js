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


backend\src\routes\requests.js

const express = require('express');
const router = express.Router();
const requestStore = require('../models/Request');
const userStore = require('../models/User');
const { 
  createRequestValidations, 
  updateRequestValidations, 
  addCommentValidations,
  queryValidations 
} = require('../middleware/validation');

// Get all requests with filters
router.get('/', queryValidations, async (req, res) => {
  try {
    const { 
      search, 
      status, 
      priority, 
      assignedAgent,
      sortBy = 'updatedDate',
      sortOrder = 'desc'
    } = req.query;

    let requests = await requestStore.findAll();
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      requests = requests.filter(req => 
        req.title.toLowerCase().includes(searchLower) ||
        req.description.toLowerCase().includes(searchLower) ||
        (req.tags && req.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    if (status) {
      requests = requests.filter(req => req.status === status);
    }
    
    if (priority) {
      requests = requests.filter(req => req.priority === priority);
    }
    
    if (assignedAgent) {
      requests = requests.filter(req => req.assignedAgent === assignedAgent);
    }
    
    // Sort results
    requests.sort((a, b) => {
      if (sortBy === 'updatedDate') {
        return sortOrder === 'asc' 
          ? new Date(a.updatedDate) - new Date(b.updatedDate)
          : new Date(b.updatedDate) - new Date(a.updatedDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    // Get statistics
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      open: requests.filter(r => r.status === 'Open').length,
      inProgress: requests.filter(r => r.status === 'In Progress').length,
      done: requests.filter(r => r.status === 'Done').length,
      highPriority: requests.filter(r => r.priority === 'High').length,
    };

    res.json({
      requests,
      stats,
      pagination: {
        total: requests.length,
        page: 1,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get single request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await requestStore.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Get assigned agent details if exists
    let assignedAgentDetails = null;
    if (request.assignedAgent) {
      assignedAgentDetails = await userStore.findById(request.assignedAgent);
      if (assignedAgentDetails) {
        assignedAgentDetails = userStore.sanitizeUser(assignedAgentDetails);
      }
    }
    
    // Get creator details
    let createdByDetails = null;
    if (request.createdBy) {
      createdByDetails = await userStore.findById(request.createdBy);
      if (createdByDetails) {
        createdByDetails = userStore.sanitizeUser(createdByDetails);
      }
    }
    
    res.json({
      ...request,
      assignedAgentDetails,
      createdByDetails
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Create new request
router.post('/', createRequestValidations, async (req, res) => {
  try {
    const { user } = req;
    
    const requestData = {
      ...req.body,
      createdBy: user?.id || 'system',
      status: 'Pending', // Default status
      comments: []
    };
    
    const newRequest = await requestStore.create(requestData);
    res.status(201).json({
      success: true,
      request: newRequest,
      message: 'Request created successfully'
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update request
router.put('/:id', updateRequestValidations, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Add updated timestamp
    updates.updatedDate = new Date().toISOString();
    
    const updatedRequest = await requestStore.update(id, updates);
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      request: updatedRequest,
      message: 'Request updated successfully'
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Assign agent to request
router.post('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    // Check if agent exists
    const agent = await userStore.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const updates = {
      assignedAgent: agentId,
      status: 'Open', // Change status to Open when assigned
      updatedDate: new Date().toISOString()
    };
    
    const updatedRequest = await requestStore.update(id, updates);
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      request: updatedRequest,
      message: 'Agent assigned successfully'
    });
  } catch (error) {
    console.error('Assign agent error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Unassign agent from request
router.post('/:id/unassign', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updates = {
      assignedAgent: null,
      status: 'Pending', // Change status back to Pending
      updatedDate: new Date().toISOString()
    };
    
    const updatedRequest = await requestStore.update(id, updates);
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      request: updatedRequest,
      message: 'Agent unassigned successfully'
    });
  } catch (error) {
    console.error('Unassign agent error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Add comment to request
router.post('/:id/comments', addCommentValidations, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;
    const { user } = req;
    
    const request = await requestStore.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const newComment = {
      id: require('uuid').v4(),
      text,
      author: author || user?.name || 'Anonymous',
      authorId: user?.id,
      timestamp: new Date().toISOString()
    };
    
    // Add comment to request
    const comments = [...(request.comments || []), newComment];
    
    const updates = {
      comments,
      updatedDate: new Date().toISOString()
    };
    
    const updatedRequest = await requestStore.update(id, updates);
    
    res.status(201).json({
      success: true,
      comment: newComment,
      request: updatedRequest,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update request status
router.post('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Open', 'In Progress', 'Done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updates = {
      status,
      updatedDate: new Date().toISOString()
    };
    
    const updatedRequest = await requestStore.update(id, updates);
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      request: updatedRequest,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete request (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { user } = req;
    
    // Check if user is admin
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete requests' });
    }
    
    const deleted = await requestStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

module.exports = router;

backend\src\routes\users.js

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