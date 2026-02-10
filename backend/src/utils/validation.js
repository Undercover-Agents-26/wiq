const { body, param, query } = require('express-validator');

const validationRules = {
  // Auth validations
  login: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3-50 characters'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],

  // Request validations
  createRequest: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5-200 characters'),
    
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    body('priority')
      .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High')
  ],

  updateRequest: [
    param('id')
      .isUUID().withMessage('Invalid request ID'),
    
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5-200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
    
    body('status')
      .optional()
      .isIn(['Pending', 'Open', 'In Progress', 'Done']).withMessage('Invalid status'),
    
    body('assignedAgent')
      .optional()
      .isUUID().withMessage('Invalid agent ID')
  ],

  addComment: [
    param('id')
      .isUUID().withMessage('Invalid request ID'),
    
    body('text')
      .trim()
      .notEmpty().withMessage('Comment text is required')
      .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1-1000 characters')
  ],

  // Query validations
  queryFilters: [
    query('search')
      .optional()
      .isString()
      .isLength({ max: 100 }).withMessage('Search query too long'),
    
    query('status')
      .optional()
      .isIn(['Pending', 'Open', 'In Progress', 'Done']).withMessage('Invalid status filter'),
    
    query('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority filter'),
    
    query('assignedAgent')
      .optional()
      .isUUID().withMessage('Invalid agent ID filter'),
    
    query('createdBy')
      .optional()
      .isUUID().withMessage('Invalid creator ID filter'),
    
    query('sortBy')
      .optional()
      .isIn(['updatedDate', 'createdDate', 'priority']).withMessage('Invalid sort field'),
    
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
  ],

  // User validations
  createUser: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3-50 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
    
    body('role')
      .isIn(['admin', 'agent']).withMessage('Role must be admin or agent'),
    
    body('employeeId')
      .trim()
      .notEmpty().withMessage('Employee ID is required')
      .isLength({ max: 20 }).withMessage('Employee ID too long')
  ]
};

module.exports = validationRules;