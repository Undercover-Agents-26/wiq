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







