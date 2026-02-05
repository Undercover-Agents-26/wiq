import { VALIDATION } from './constants';

/**
 * Validate request title
 * @param {string} title - Title to validate
 * @returns {Object} Validation result
 */
export const validateTitle = (title) => {
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (title && title.length < VALIDATION.TITLE.MIN_LENGTH) {
    errors.push(`Title must be at least ${VALIDATION.TITLE.MIN_LENGTH} characters`);
  }
  
  if (title && title.length > VALIDATION.TITLE.MAX_LENGTH) {
    errors.push(`Title must be less than ${VALIDATION.TITLE.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate request description
 * @param {string} description - Description to validate
 * @returns {Object} Validation result
 */
export const validateDescription = (description) => {
  const errors = [];
  
  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (description && description.length < VALIDATION.DESCRIPTION.MIN_LENGTH) {
    errors.push(`Description must be at least ${VALIDATION.DESCRIPTION.MIN_LENGTH} characters`);
  }
  
  if (description && description.length > VALIDATION.DESCRIPTION.MAX_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION.DESCRIPTION.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate comment text
 * @param {string} comment - Comment to validate
 * @returns {Object} Validation result
 */
export const validateComment = (comment) => {
  const errors = [];
  
  if (!comment || comment.trim() === '') {
    errors.push('Comment is required');
  }
  
  if (comment && comment.length > VALIDATION.COMMENT.MAX_LENGTH) {
    errors.push(`Comment must be less than ${VALIDATION.COMMENT.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate priority
 * @param {string} priority - Priority to validate
 * @returns {Object} Validation result
 */
export const validatePriority = (priority) => {
  const validPriorities = ['Low', 'Medium', 'High'];
  const errors = [];
  
  if (!priority) {
    errors.push('Priority is required');
  } else if (!validPriorities.includes(priority)) {
    errors.push('Invalid priority value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate status
 * @param {string} status - Status to validate
 * @returns {Object} Validation result
 */
export const validateStatus = (status) => {
  const validStatuses = ['Open', 'In Progress', 'Done'];
  const errors = [];
  
  if (!status) {
    errors.push('Status is required');
  } else if (!validStatuses.includes(status)) {
    errors.push('Invalid status value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate request data
 * @param {Object} data - Request data to validate
 * @returns {Object} Validation result with all errors
 */
export const validateRequestData = (data) => {
  const titleValidation = validateTitle(data.title);
  const descriptionValidation = validateDescription(data.description);
  const priorityValidation = validatePriority(data.priority);
  const statusValidation = data.status ? validateStatus(data.status) : { isValid: true, errors: [] };
  
  const allErrors = [
    ...titleValidation.errors,
    ...descriptionValidation.errors,
    ...priorityValidation.errors,
    ...statusValidation.errors
  ];
  
  const isValid = titleValidation.isValid && 
                  descriptionValidation.isValid && 
                  priorityValidation.isValid && 
                  statusValidation.isValid;
  
  return {
    isValid,
    errors: allErrors,
    fieldErrors: {
      title: titleValidation.errors,
      description: descriptionValidation.errors,
      priority: priorityValidation.errors,
      status: statusValidation.errors
    }
  };
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous HTML tags
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date string
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid date
 */
export const validateDate = (dateStr) => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

/**
 * Check if string contains only numbers
 * @param {string} str - String to check
 * @returns {boolean} True if only numbers
 */
export const isNumeric = (str) => {
  return /^\d+$/.test(str);
};

/**
 * Check if string is a valid JSON
 * @param {string} str - String to check
 * @returns {boolean} True if valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};