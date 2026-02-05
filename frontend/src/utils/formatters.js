import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';

/**
 * Number formatting utilities
 */

/**
 * Format number with commas
 * @param {number|string} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || num === '') return '0';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return '0';
  
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

/**
 * Format number as currency
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || amount === '') return '$0.00';
  
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(number)) return '$0.00';
  
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Format percentage
 * @param {number|string} value - Percentage value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || value === '') return '0%';
  
  const number = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(number)) return '0%';
  
  return `${number.toFixed(decimals)}%`;
};

/**
 * Date formatting utilities
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return 'Invalid date';
    
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Unknown';
  }
};

/**
 * Format date to short string
 * @param {string|Date} date - Date to format
 * @returns {string} Short date string
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'MM/dd/yyyy');
  } catch (error) {
    console.error('Short date formatting error:', error);
    return '';
  }
};

/**
 * Format date to long string
 * @param {string|Date} date - Date to format
 * @returns {string} Long date string
 */
export const formatLongDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'MMMM dd, yyyy');
  } catch (error) {
    console.error('Long date formatting error:', error);
    return '';
  }
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Date time formatting error:', error);
    return '';
  }
};

/**
 * Format date for input fields
 * @param {string|Date} date - Date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date input formatting error:', error);
    return '';
  }
};

/**
 * Text formatting utilities
 */

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 */
export const toCamelCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
};

/**
 * Convert string to snake_case
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 */
export const toSnakeCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/\s+/g, '_')
    .toLowerCase();
};

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string} kebab-case string
 */
export const toKebabCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/\s+/g, '-')
    .toLowerCase();
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds && milliseconds !== 0) return 'N/A';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format phone number
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
  }
  
  // Return original if format doesn't match
  return phoneNumber;
};

/**
 * Mask sensitive information
 * @param {string} value - Value to mask
 * @param {number} visibleChars - Number of visible characters at start and end
 * @returns {string} Masked value
 */
export const maskSensitiveInfo = (value, visibleChars = 4) => {
  if (!value || typeof value !== 'string') return '';
  
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length);
  }
  
  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(value.length - visibleChars * 2);
  
  return start + middle + end;
};

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, adds 's' by default)
 * @returns {string} Pluralized string
 */
export const pluralize = (count, singular, plural = null) => {
  const pluralForm = plural || singular + 's';
  return count === 1 ? `${count} ${singular}` : `${count} ${pluralForm}`;
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitialsFromName = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join('')
    .substring(0, 2);
};
