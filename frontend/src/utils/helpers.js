import { 
  PRIORITY_OPTIONS, 
  STATUS_OPTIONS, 
  THEME,
  DATE_FORMATS 
} from './constants';
import { format, parseISO, isValid, isToday, isYesterday } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (defaults to DISPLAY_WITH_TIME)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY_WITH_TIME) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return 'Invalid Date';
    
    // Check for relative dates
    if (isToday(dateObj)) {
      return `Today, ${format(dateObj, 'HH:mm')}`;
    }
    
    if (isYesterday(dateObj)) {
      return `Yesterday, ${format(dateObj, 'HH:mm')}`;
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Get color for priority level
 * @param {string} priority - Priority value
 * @returns {string} Color string
 */
export const getPriorityColor = (priority) => {
  const priorityObj = PRIORITY_OPTIONS.find(p => p.value === priority);
  return priorityObj?.color || 'default';
};

/**
 * Get color for status
 * @param {string} status - Status value
 * @returns {string} Color string
 */
export const getStatusColor = (status) => {
  const statusObj = STATUS_OPTIONS.find(s => s.value === status);
  return statusObj?.color || 'default';
};

/**
 * Get label for priority
 * @param {string} priority - Priority value
 * @returns {string} Label string
 */
export const getPriorityLabel = (priority) => {
  const priorityObj = PRIORITY_OPTIONS.find(p => p.value === priority);
  return priorityObj?.label || priority;
};

/**
 * Get label for status
 * @param {string} status - Status value
 * @returns {string} Label string
 */
export const getStatusLabel = (status) => {
  const statusObj = STATUS_OPTIONS.find(s => s.value === status);
  return statusObj?.label || status;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Parse query parameters from URL
 * @param {string} queryString - Query string
 * @returns {Object} Parsed query parameters
 */
export const parseQueryParams = (queryString = window.location.search) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Convert object to query string
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Calculate time difference in readable format
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (defaults to now)
 * @returns {string} Time difference string
 */
export const getTimeDifference = (startDate, endDate = new Date()) => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) return 'Invalid date';
    
    const diffMs = Math.abs(end - start);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    console.error('Time difference calculation error:', error);
    return 'Unknown';
  }
};

/**
 * Create a download link for JSON data
 * @param {Object} data - Data to download
 * @param {string} filename - Download filename
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};