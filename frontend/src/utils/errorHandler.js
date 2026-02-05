import { ERROR_MESSAGES } from './constants';

/**
 * Error Handler Utility
 * Centralized error handling for the application
 */

/**
 * Handle API errors
 * @param {Error|Object} error - Error object
 * @param {string} context - Context of the error
 * @returns {Object} User-friendly error information
 */
export const handleApiError = (error, context = 'API request') => {
  console.error(`[${context}] Error:`, error);

  let userMessage = ERROR_MESSAGES.DEFAULT;
  let statusCode = null;
  let retryable = false;
  let originalError = error;

  // Handle axios errors
  if (error.isAxiosError) {
    if (error.code === 'ECONNABORTED') {
      userMessage = ERROR_MESSAGES.TIMEOUT;
      retryable = true;
    } else if (!error.response) {
      userMessage = ERROR_MESSAGES.NETWORK_ERROR;
      retryable = true;
    } else {
      statusCode = error.response.status;
      
      switch (statusCode) {
        case 400:
          userMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          userMessage = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 403:
          userMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          userMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 409:
          userMessage = 'A conflict occurred. Please try again.';
          retryable = true;
          break;
        case 422:
          userMessage = 'Validation failed. Please check your input.';
          break;
        case 429:
          userMessage = 'Too many requests. Please try again later.';
          retryable = true;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          userMessage = ERROR_MESSAGES.SERVER_ERROR;
          retryable = true;
          break;
        default:
          userMessage = error.response.data?.error || ERROR_MESSAGES.DEFAULT;
      }
    }
  } 
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    userMessage = ERROR_MESSAGES.VALIDATION_ERROR;
  }
  // Handle network errors
  else if (error.message && error.message.includes('Network Error')) {
    userMessage = ERROR_MESSAGES.NETWORK_ERROR;
    retryable = true;
  }

  return {
    userMessage,
    statusCode,
    retryable,
    originalError,
    timestamp: new Date().toISOString(),
    context
  };
};

/**
 * Log error to console with context
 * @param {Error|string} error - Error to log
 * @param {string} context - Error context
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context = 'Application', additionalData = {}) => {
  const errorObj = error instanceof Error ? error : new Error(error);
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    message: errorObj.message,
    stack: errorObj.stack,
    ...additionalData
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`[ERROR] ${context}`);
    console.error('Message:', errorObj.message);
    console.error('Stack:', errorObj.stack);
    
    if (Object.keys(additionalData).length > 0) {
      console.error('Additional Data:', additionalData);
    }
    
    console.groupEnd();
  }

  // In a real app, you would send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
  // logToErrorService(logEntry);
};

/**
 * Create user-friendly error message
 * @param {string} action - Action that failed
 * @param {string} resource - Resource type
 * @returns {string} User-friendly message
 */
export const createUserMessage = (action, resource) => {
  const actions = {
    create: 'creating',
    read: 'loading',
    update: 'updating',
    delete: 'deleting',
    search: 'searching'
  };

  const resources = {
    request: 'work request',
    comment: 'comment',
    list: 'list'
  };

  const actionText = actions[action] || action;
  const resourceText = resources[resource] || resource;

  return `Error ${actionText} ${resourceText}. Please try again.`;
};

/**
 * Handle form validation errors
 * @param {Object} errors - Validation errors object
 * @returns {Array} Formatted error messages
 */
export const handleValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  const formattedErrors = [];

  // Handle array of errors
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      if (error.message) {
        formattedErrors.push(error.message);
      }
    });
  } 
  // Handle object with field errors
  else {
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(error => {
          formattedErrors.push(`${field}: ${error}`);
        });
      } else if (typeof fieldErrors === 'string') {
        formattedErrors.push(`${field}: ${fieldErrors}`);
      }
    });
  }

  return formattedErrors;
};

/**
 * Global error boundary handler
 * @param {Error} error - Error object
 * @param {Object} errorInfo - Error info from React
 */
export const handleReactError = (error, errorInfo) => {
  logError(error, 'React Error Boundary', {
    componentStack: errorInfo.componentStack
  });

  return {
    hasError: true,
    error,
    errorInfo
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves when function succeeds or retries exhausted
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry non-retryable errors
      if (!error.retryable && error.statusCode && error.statusCode < 500) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Error boundary component props
 * @param {Error} error - Error object
 * @returns {Object} Props for error boundary
 */
export const getErrorBoundaryProps = (error) => {
  const handledError = handleApiError(error, 'React Component');
  
  return {
    error: handledError.userMessage,
    retryable: handledError.retryable,
    statusCode: handledError.statusCode
  };
};

/**
 * Create error object from response
 * @param {Object} response - API response
 * @returns {Error} Error object
 */
export const createErrorFromResponse = (response) => {
  const error = new Error(response.data?.message || 'Unknown error');
  error.statusCode = response.status;
  error.response = response;
  error.retryable = response.status >= 500;
  
  return error;
};