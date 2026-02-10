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
