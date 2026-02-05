/**
 * Utility Barrel File
 * 
 * This file exports all utility functions and constants
 * from the utils directory for easier imports.
 * 
 * Usage examples:
 * import { formatDate, getPriorityColor } from './utils';
 * import { API_BASE_URL, USER_ROLES } from './utils';
 * import { validateRequestData, sanitizeInput } from './utils';
 * import { getUserRole, saveUserRole } from './utils';
 * import { handleApiError, logError } from './utils';
 * import { formatCurrency, formatRelativeTime } from './utils';
 */

// Constants
export * from './constants';

// Helper functions
export {
  formatDate,
  getPriorityColor,
  getStatusColor,
  getPriorityLabel,
  getStatusLabel,
  truncateText,
  debounce,
  throttle,
  generateId,
  parseQueryParams,
  toQueryString,
  deepClone,
  isEmptyObject,
  getInitials,
  getTimeDifference,
  downloadJSON
} from './helpers';

// Validation functions
export {
  validateTitle,
  validateDescription,
  validateComment,
  validatePriority,
  validateStatus,
  validateRequestData,
  sanitizeInput,
  validateEmail,
  validateUrl,
  validateDate,
  isNumeric,
  isValidJSON
} from './validation';

// Storage functions
export {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  clearAppStorage,
  getUserRole,
  saveUserRole,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  getFilterPreferences,
  saveFilterPreferences,
  clearFilterPreferences,
  getFromSession,
  saveToSession,
  removeFromSession,
  getStorageInfo,
  isStorageAvailable
} from './storage';

// Error handling functions
export {
  handleApiError,
  logError,
  createUserMessage,
  handleValidationErrors,
  handleReactError,
  retryWithBackoff,
  getErrorBoundaryProps,
  createErrorFromResponse
} from './errorHandler';

// Formatter functions
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatRelativeTime,
  formatShortDate,
  formatLongDate,
  formatDateTime,
  formatDateForInput,
  capitalizeWords,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  formatFileSize,
  formatDuration,
  formatPhoneNumber,
  maskSensitiveInfo,
  pluralize,
  getInitialsFromName
} from './formatters';

// Re-export specific constants with clearer names for convenience
export { PRIORITY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from './constants';
export { AGENT_OPTIONS } from './constants';
export { USER_ROLES, PERMISSIONS } from './constants';
export { STORAGE_KEYS } from './constants';
export { VALIDATION } from './constants';
export { DATE_FORMATS } from './constants';
export { THEME } from './constants';
export { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

// Export default object for backward compatibility
const utils = {
  // Constants
  constants: {
    APP_NAME: require('./constants').APP_NAME,
    API_BASE_URL: require('./constants').API_BASE_URL,
    PRIORITY_OPTIONS: require('./constants').PRIORITY_OPTIONS,
    STATUS_OPTIONS: require('./constants').STATUS_OPTIONS,
    USER_ROLES: require('./constants').USER_ROLES,
    PERMISSIONS: require('./constants').PERMISSIONS,
    STORAGE_KEYS: require('./constants').STORAGE_KEYS,
    VALIDATION: require('./constants').VALIDATION,
    DATE_FORMATS: require('./constants').DATE_FORMATS,
    THEME: require('./constants').THEME,
    ERROR_MESSAGES: require('./constants').ERROR_MESSAGES,
    SUCCESS_MESSAGES: require('./constants').SUCCESS_MESSAGES
  },
  
  // Helpers
  formatDate: require('./helpers').formatDate,
  getPriorityColor: require('./helpers').getPriorityColor,
  getStatusColor: require('./helpers').getStatusColor,
  truncateText: require('./helpers').truncateText,
  debounce: require('./helpers').debounce,
  throttle: require('./helpers').throttle,
  
  // Validation
  validateRequestData: require('./validation').validateRequestData,
  sanitizeInput: require('./validation').sanitizeInput,
  
  // Storage
  getUserRole: require('./storage').getUserRole,
  saveUserRole: require('./storage').saveUserRole,
  getFromStorage: require('./storage').getFromStorage,
  saveToStorage: require('./storage').saveToStorage,
  
  // Error Handling
  handleApiError: require('./errorHandler').handleApiError,
  logError: require('./errorHandler').logError,
  
  // Formatters
  formatCurrency: require('./formatters').formatCurrency,
  formatRelativeTime: require('./formatters').formatRelativeTime,
  formatDateTime: require('./formatters').formatDateTime,
  pluralize: require('./formatters').pluralize
};

export default utils;

// TypeScript-like type exports (for better IDE support)
/**
 * @typedef {Object} RequestData
 * @property {string} title
 * @property {string} description
 * @property {'Low'|'Medium'|'High'} priority
 * @property {'Open'|'In Progress'|'Done'} status
 * @property {string|null} assignedAgent
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string[]} errors
 * @property {Object} fieldErrors
 */

/**
 * @typedef {Object} ApiError
 * @property {string} userMessage
 * @property {number|null} statusCode
 * @property {boolean} retryable
 * @property {Error} originalError
 * @property {string} timestamp
 * @property {string} context
 */

/**
 * @typedef {Object} StorageInfo
 * @property {Object} localStorage
 * @property {number} localStorage.bytes
 * @property {string} localStorage.kilobytes
 * @property {string} localStorage.megabytes
 * @property {Object} sessionStorage
 * @property {number} sessionStorage.bytes
 * @property {string} sessionStorage.kilobytes
 * @property {string} sessionStorage.megabytes
 */