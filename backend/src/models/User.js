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