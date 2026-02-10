const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class BaseStore {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '../../data', fileName);
    this.data = [];
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      
      try {
        const fileContent = await fs.readFile(this.filePath, 'utf8');
        if (fileContent.trim()) {
          this.data = JSON.parse(fileContent);
          logger.info(`Loaded ${this.data.length} items from ${path.basename(this.filePath)}`);
        }
      } catch (readError) {
        // File doesn't exist or is empty
        this.data = [];
        await this.save();
      }
    } catch (error) {
      logger.error(`Error initializing store ${this.filePath}:`, error);
      throw error;
    }
  }

  async save() {
    try {
      const dataToSave = JSON.stringify(this.data, null, 2);
      await fs.writeFile(this.filePath, dataToSave, 'utf8');
    } catch (error) {
      logger.error(`Error saving data to ${this.filePath}:`, error);
      throw error;
    }
  }

  async findById(id) {
    return this.data.find(item => item.id === id);
  }

  async findAll(predicate = null) {
    if (predicate) {
      return this.data.filter(predicate);
    }
    return [...this.data];
  }

  async create(item) {
    const newItem = {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.data.push(newItem);
    await this.save();
    return newItem;
  }

  async update(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.save();
    return this.data[index];
  }

  async delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.data.splice(index, 1);
    await this.save();
    return true;
  }

  async exists(id) {
    return this.data.some(item => item.id === id);
  }

  async count(predicate = null) {
    if (predicate) {
      return this.data.filter(predicate).length;
    }
    return this.data.length;
  }

  async clear() {
    this.data = [];
    await this.save();
  }

  async backup(backupPath = null) {
    const backupFilePath = backupPath || 
      path.join(__dirname, '../../backups', `${path.basename(this.filePath)}.${Date.now()}.backup`);
    
    await fs.mkdir(path.dirname(backupFilePath), { recursive: true });
    await fs.copyFile(this.filePath, backupFilePath);
    
    logger.info(`Backup created: ${backupFilePath}`);
    return backupFilePath;
  }
}

module.exports = BaseStore;


backend\src\models\Request.js

const { v4: uuidv4 } = require('uuid');
const BaseStore = require('./BaseStore');

class RequestStore extends BaseStore {
  constructor() {
    super('requests.json');
  }

  async initialize() {
    await super.initialize();
    
    // Create sample requests if none exist
    if (this.data.length === 0) {
      await this.createSampleRequests();
    }
  }

  async createSampleRequests() {
    const sampleRequests = [
      {
        id: uuidv4(),
        title: 'Server Maintenance Required',
        description: 'The main production server needs urgent maintenance. Several performance issues have been reported.',
        priority: 'High',
        status: 'Open',
        createdBy: '1', // admin
        assignedAgent: '2', // agent1
        tags: ['server', 'maintenance', 'urgent'],
        comments: [
          {
            id: uuidv4(),
            text: 'This needs to be addressed immediately.',
            author: 'System Administrator',
            authorId: '1',
            timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ],
        createdDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedDate: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'Database Backup Schedule',
        description: 'Need to set up automated daily backups for the customer database.',
        priority: 'Medium',
        status: 'Pending',
        createdBy: '1', // admin
        assignedAgent: null,
        tags: ['database', 'backup', 'automation'],
        comments: [],
        createdDate: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updatedDate: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: uuidv4(),
        title: 'UI Bug Fix - Dashboard',
        description: 'Users reporting that the dashboard statistics are not updating in real-time.',
        priority: 'Medium',
        status: 'In Progress',
        createdBy: '2', // agent1
        assignedAgent: '3', // agent2
        tags: ['ui', 'bug', 'dashboard'],
        comments: [
          {
            id: uuidv4(),
            text: 'Investigating the issue now.',
            author: 'Jane Doe',
            authorId: '3',
            timestamp: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
          }
        ],
        createdDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updatedDate: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: uuidv4(),
        title: 'New Feature Request - Reports Export',
        description: 'Clients requesting ability to export reports in PDF and Excel formats.',
        priority: 'Low',
        status: 'Done',
        createdBy: '3', // agent2
        assignedAgent: '4', // agent3
        tags: ['feature', 'reports', 'export'],
        comments: [
          {
            id: uuidv4(),
            text: 'Feature implemented successfully.',
            author: 'Mike Johnson',
            authorId: '4',
            timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
          }
        ],
        createdDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        updatedDate: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      }
    ];
    
    this.data = sampleRequests;
    await this.save();
    console.log('Sample requests created');
  }

  async findByAssignedAgent(agentId) {
    return this.data.filter(req => req.assignedAgent === agentId);
  }

  async findByStatus(status) {
    return this.data.filter(req => req.status === status);
  }

  async findByPriority(priority) {
    return this.data.filter(req => req.priority === priority);
  }

  async searchRequests(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.data.filter(req => 
      req.title.toLowerCase().includes(term) ||
      req.description.toLowerCase().includes(term) ||
      (req.tags && req.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  }

  async getStatistics() {
    return {
      total: this.data.length,
      byStatus: {
        pending: this.data.filter(req => req.status === 'Pending').length,
        open: this.data.filter(req => req.status === 'Open').length,
        inProgress: this.data.filter(req => req.status === 'In Progress').length,
        done: this.data.filter(req => req.status === 'Done').length
      },
      byPriority: {
        high: this.data.filter(req => req.priority === 'High').length,
        medium: this.data.filter(req => req.priority === 'Medium').length,
        low: this.data.filter(req => req.priority === 'Low').length
      },
      unassigned: this.data.filter(req => !req.assignedAgent).length
    };
  }
}

module.exports = new RequestStore();


backend\src\models\User.js

const { v4: uuidv4 } = require('uuid');
const BaseStore = require('./BaseStore');
const Helpers = require('../utils/helpers');

class UserStore extends BaseStore {
  constructor() {
    super('users.json');
  }

  async initialize() {
    await super.initialize();
    
    // Create default users if none exist
    if (this.data.length === 0) {
      await this.createDefaultUsers();
    }
  }

  async createDefaultUsers() {
    const defaultUsers = [
      {
        id: uuidv4(),
        username: 'admin',
        password: await Helpers.hashPassword('admin123'),
        name: 'System Administrator',
        role: 'admin',
        employeeId: 'ADM-001',
        email: 'admin@wiq.com',
        isActive: true
      },
      {
        id: uuidv4(),
        username: 'agent1',
        password: await Helpers.hashPassword('agent123'),
        name: 'John Smith',
        role: 'agent',
        employeeId: 'AGT-001',
        email: 'john.smith@wiq.com',
        isActive: true
      },
      {
        id: uuidv4(),
        username: 'agent2',
        password: await Helpers.hashPassword('agent123'),
        name: 'Jane Doe',
        role: 'agent',
        employeeId: 'AGT-002',
        email: 'jane.doe@wiq.com',
        isActive: true
      },
      {
        id: uuidv4(),
        username: 'agent3',
        password: await Helpers.hashPassword('agent123'),
        name: 'Mike Johnson',
        role: 'agent',
        employeeId: 'AGT-003',
        email: 'mike.johnson@wiq.com',
        isActive: true
      }
    ];
    
    this.data = defaultUsers;
    await this.save();
    console.log('Default users created');
  }

  async findByUsername(username) {
    return this.data.find(user => user.username === username && user.isActive !== false);
  }

  async findByEmail(email) {
    return this.data.find(user => user.email === email && user.isActive !== false);
  }

  async findByEmployeeId(employeeId) {
    return this.data.find(user => user.employeeId === employeeId && user.isActive !== false);
  }

  async verifyPassword(user, password) {
    return Helpers.comparePassword(password, user.password);
  }

  async create(userData) {
    // Check if username already exists
    const existingUser = await this.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check if employeeId already exists
    const existingEmployee = await this.findByEmployeeId(userData.employeeId);
    if (existingEmployee) {
      throw new Error('Employee ID already exists');
    }

    const hashedPassword = await Helpers.hashPassword(userData.password);
    
    const newUser = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return super.create(newUser);
  }

  async update(id, updates) {
    // Don't allow updating password directly through this method
    if (updates.password) {
      delete updates.password;
    }
    
    return super.update(id, updates);
  }

  async updatePassword(id, newPassword) {
    const hashedPassword = await Helpers.hashPassword(newPassword);
    return super.update(id, { password: hashedPassword });
  }

  async deactivate(id) {
    return super.update(id, { isActive: false });
  }

  async activate(id) {
    return super.update(id, { isActive: true });
  }

  async findAllAgents() {
    return this.data.filter(user => user.role === 'agent' && user.isActive !== false);
  }

  async findAllActive() {
    return this.data.filter(user => user.isActive !== false);
  }

  async getStatistics() {
    const activeUsers = this.data.filter(user => user.isActive !== false);
    
    return {
      total: activeUsers.length,
      byRole: {
        admin: activeUsers.filter(user => user.role === 'admin').length,
        agent: activeUsers.filter(user => user.role === 'agent').length
      },
      active: activeUsers.length,
      inactive: this.data.filter(user => user.isActive === false).length
    };
  }

  sanitizeUser(user) {
    if (!user) return null;
    
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  sanitizeUsers(users) {
    return users.map(user => this.sanitizeUser(user));
  }
}

module.exports = new UserStore();


