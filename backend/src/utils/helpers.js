const bcrypt = require('bcryptjs');

class Helpers {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateEmployeeId(role, count) {
    const prefix = role === 'admin' ? 'ADM' : 'AGT';
    const paddedCount = count.toString().padStart(3, '0');
    return `${prefix}-${paddedCount}`;
  }

  static formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }

  static formatDateTime(date) {
    return new Date(date).toISOString().replace('T', ' ').split('.')[0];
  }

  static sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static paginate(array, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {};
    
    if (endIndex < array.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
    
    results.total = array.length;
    results.page = page;
    results.limit = limit;
    results.totalPages = Math.ceil(array.length / limit);
    results.data = array.slice(startIndex, endIndex);
    
    return results;
  }

  static validateUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static calculatePriorityScore(priority) {
    const scores = {
      'Low': 1,
      'Medium': 2,
      'High': 3
    };
    return scores[priority] || 0;
  }

  static getStatusOrder(status) {
    const order = {
      'Pending': 1,
      'Open': 2,
      'In Progress': 3,
      'Done': 4
    };
    return order[status] || 0;
  }
}

module.exports = Helpers;