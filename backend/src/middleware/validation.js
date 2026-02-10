// Simple validation middleware without express-validator
const validateRequest = (req, res, next) => {
  // No validation logic for now - just pass through
  next();
};

const createRequestValidations = [
  // Simple validation that always passes
  (req, res, next) => {
    const { title, description, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        errors: [{ msg: 'Title is required', param: 'title' }] 
      });
    }
    
    if (title.length > 200) {
      return res.status(400).json({ 
        errors: [{ msg: 'Title must be less than 200 characters', param: 'title' }] 
      });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({ 
        errors: [{ msg: 'Description is required', param: 'description' }] 
      });
    }
    
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        errors: [{ msg: 'Priority must be Low, Medium, or High', param: 'priority' }] 
      });
    }
    
    next();
  }
];

const updateRequestValidations = [
  // Validate ID parameter
  (req, res, next) => {
    const { id } = req.params;
    
    // Simple UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid request ID format', param: 'id' }] 
      });
    }
    
    // Validate request body if provided
    const { title, priority, status } = req.body;
    
    if (title && title.length > 200) {
      return res.status(400).json({ 
        errors: [{ msg: 'Title must be less than 200 characters', param: 'title' }] 
      });
    }
    
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
          errors: [{ msg: 'Priority must be Low, Medium, or High', param: 'priority' }] 
        });
      }
    }
    
    if (status) {
      const validStatuses = ['Open', 'In Progress', 'Done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          errors: [{ msg: 'Status must be Open, In Progress, or Done', param: 'status' }] 
        });
      }
    }
    
    next();
  }
];

const addCommentValidations = [
  // Validate ID parameter
  (req, res, next) => {
    const { id } = req.params;
    
    // Simple UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return res.status(400).json({ 
        errors: [{ msg: 'Invalid request ID format', param: 'id' }] 
      });
    }
    
    // Validate comment data
    const { text, author } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        errors: [{ msg: 'Comment text is required', param: 'text' }] 
      });
    }
    
    if (!author || author.trim() === '') {
      return res.status(400).json({ 
        errors: [{ msg: 'Author is required', param: 'author' }] 
      });
    }
    
    next();
  }
];

const queryValidations = [
  // Validate query parameters
  (req, res, next) => {
    const { search, status, priority, sortBy } = req.query;
    
    if (status) {
      const validStatuses = ['Open', 'In Progress', 'Done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          errors: [{ msg: 'Invalid status value', param: 'status' }] 
        });
      }
    }
    
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
          errors: [{ msg: 'Invalid priority value', param: 'priority' }] 
        });
      }
    }
    
    if (sortBy) {
      const validSortFields = ['updatedDate', 'priority'];
      if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({ 
          errors: [{ msg: 'Invalid sortBy value', param: 'sortBy' }] 
        });
      }
    }
    
    next();
  }
];

module.exports = {
  createRequestValidations,
  updateRequestValidations,
  addCommentValidations,
  queryValidations,
  validateRequest
};