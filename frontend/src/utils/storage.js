import { STORAGE_KEYS, USER_ROLES } from './constants';

/**
 * Local Storage Service
 * Provides methods for working with localStorage with error handling
 */

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Retrieved value or defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Save item to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const saveToStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all application data from localStorage
 * @returns {boolean} Success status
 */
export const clearAppStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing app storage:', error);
    return false;
  }
};

/**
 * Get user role from storage
 * @returns {string} User role
 */
export const getUserRole = () => {
  const role = getFromStorage(STORAGE_KEYS.USER_ROLE, USER_ROLES.ADMIN);
  return Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.ADMIN;
};

/**
 * Save user role to storage
 * @param {string} role - User role
 * @returns {boolean} Success status
 */
export const saveUserRole = (role) => {
  if (!Object.values(USER_ROLES).includes(role)) {
    console.error('Invalid user role:', role);
    return false;
  }
  
  return saveToStorage(STORAGE_KEYS.USER_ROLE, role);
};

/**
 * Get recent searches from storage
 * @returns {Array} Recent searches
 */
export const getRecentSearches = () => {
  return getFromStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
};

/**
 * Save search term to recent searches
 * @param {string} searchTerm - Search term
 * @param {number} maxItems - Maximum number of items to keep
 * @returns {boolean} Success status
 */
export const saveRecentSearch = (searchTerm, maxItems = 10) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return false;
  }
  
  const trimmedTerm = searchTerm.trim();
  if (!trimmedTerm) {
    return false;
  }
  
  const recentSearches = getRecentSearches();
  
  // Remove if already exists
  const filteredSearches = recentSearches.filter(term => term !== trimmedTerm);
  
  // Add to beginning
  filteredSearches.unshift(trimmedTerm);
  
  // Limit the number of items
  const limitedSearches = filteredSearches.slice(0, maxItems);
  
  return saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, limitedSearches);
};

/**
 * Clear recent searches
 * @returns {boolean} Success status
 */
export const clearRecentSearches = () => {
  return removeFromStorage(STORAGE_KEYS.RECENT_SEARCHES);
};

/**
 * Get filter preferences from storage
 * @returns {Object} Filter preferences
 */
export const getFilterPreferences = () => {
  return getFromStorage(STORAGE_KEYS.FILTER_PREFERENCES, {});
};

/**
 * Save filter preferences
 * @param {Object} preferences - Filter preferences
 * @returns {boolean} Success status
 */
export const saveFilterPreferences = (preferences) => {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }
  
  return saveToStorage(STORAGE_KEYS.FILTER_PREFERENCES, preferences);
};

/**
 * Clear filter preferences
 * @returns {boolean} Success status
 */
export const clearFilterPreferences = () => {
  return removeFromStorage(STORAGE_KEYS.FILTER_PREFERENCES);
};

/**
 * Session Storage Service
 * Provides methods for working with sessionStorage
 */

/**
 * Get item from sessionStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Retrieved value or defaultValue
 */
export const getFromSession = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Save item to sessionStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const saveToSession = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromSession = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from sessionStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Storage quota estimation
 * @returns {Object} Storage usage information
 */
export const getStorageInfo = () => {
  try {
    const localStorageSize = JSON.stringify(localStorage).length;
    const sessionStorageSize = JSON.stringify(sessionStorage).length;
    
    return {
      localStorage: {
        bytes: localStorageSize,
        kilobytes: (localStorageSize / 1024).toFixed(2),
        megabytes: (localStorageSize / (1024 * 1024)).toFixed(4)
      },
      sessionStorage: {
        bytes: sessionStorageSize,
        kilobytes: (sessionStorageSize / 1024).toFixed(2),
        megabytes: (sessionStorageSize / (1024 * 1024)).toFixed(4)
      }
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Check if storage is available
 * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
 * @returns {boolean} True if storage is available
 */
export const isStorageAvailable = (type = 'localStorage') => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    
    return true;
  } catch (error) {
    console.error(`${type} is not available:`, error);
    return false;
  }
};