// Application constants
export const APP_NAME = 'WIQ - Work Intelligence Queue';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Request Constants
export const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'success' },
  { value: 'Medium', label: 'Medium', color: 'warning' },
  { value: 'High', label: 'High', color: 'error' }
];

export const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open', color: 'info' },
  { value: 'In Progress', label: 'In Progress', color: 'primary' },
  { value: 'Done', label: 'Done', color: 'success' }
];

export const SORT_OPTIONS = [
  { value: 'updatedDate', label: 'Last Updated' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdDate', label: 'Created Date' }
];

// Agent Constants
export const AGENT_OPTIONS = [
  'Agent 1',
  'Agent 2', 
  'Agent 3',
  'Agent 4',
  'Agent 5'
];

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent'
};

// Permission Constants
export const PERMISSIONS = {
  // Admin permissions
  [USER_ROLES.ADMIN]: {
    canCreateRequest: true,
    canEditAllRequests: true,
    canDeleteRequest: true,
    canAssignAgent: true,
    canChangeStatus: true,
    canViewAllRequests: true,
    canViewStats: true
  },
  // Agent permissions
  [USER_ROLES.AGENT]: {
    canCreateRequest: true,
    canEditAllRequests: false,
    canDeleteRequest: false,
    canAssignAgent: false,
    canChangeStatus: true,
    canViewAllRequests: false,
    canViewStats: false
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ROLE: 'wiq_user_role',
  RECENT_SEARCHES: 'wiq_recent_searches',
  FILTER_PREFERENCES: 'wiq_filter_preferences'
};

// Validation Constants
export const VALIDATION = {
  TITLE: {
    MAX_LENGTH: 200,
    MIN_LENGTH: 3
  },
  DESCRIPTION: {
    MAX_LENGTH: 5000,
    MIN_LENGTH: 10
  },
  COMMENT: {
    MAX_LENGTH: 1000,
    MIN_LENGTH: 1
  }
};

// Date Format Constants
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''
};

// Theme Constants
export const THEME = {
  COLORS: {
    PRIORITY: {
      HIGH: '#f44336',
      MEDIUM: '#ff9800',
      LOW: '#4caf50'
    },
    STATUS: {
      OPEN: '#2196f3',
      IN_PROGRESS: '#9c27b0',
      DONE: '#4caf50'
    }
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Request not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  TIMEOUT: 'Request timeout. Please try again.',
  DEFAULT: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REQUEST_CREATED: 'Request created successfully!',
  REQUEST_UPDATED: 'Request updated successfully!',
  REQUEST_DELETED: 'Request deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  STATUS_UPDATED: 'Status updated successfully!',
  AGENT_ASSIGNED: 'Agent assigned successfully!'
};