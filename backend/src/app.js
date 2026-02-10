const express = require('express');
const cors = require('cors');
const requestRoutes = require('./routes/requests');
const authRoutes = require('./routes/auth');
const { optionalAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Optional auth middleware for all routes
app.use(optionalAuth);

// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'WIQ Backend',
    version: '1.0.0'
  });
});

// ========== ADD THIS: Login endpoint that frontend expects ==========
// This handles /login (what your frontend is calling)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Demo users
  const users = {
    'admin': { 
      password: 'admin123', 
      role: 'admin', 
      name: 'System Administrator',
      employeeId: 'ADM-001',
      id: '1'
    },
    'agent1': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'John Smith',
      employeeId: 'AGT-001',
      id: '2'
    },
    'agent2': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'Jane Doe',
      employeeId: 'AGT-002',
      id: '3'
    },
    'agent3': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'Mike Johnson',
      employeeId: 'AGT-003',
      id: '4'
    }
  };
  
  const user = users[username];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      message: 'Please check your username and password'
    });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      username,
      role: user.role,
      name: user.name,
      employeeId: user.employeeId
    },
    message: 'Login successful'
  });
});

// Demo login route (for testing without JWT) - Keep this for other clients
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Demo users
  const users = {
    'admin': { 
      password: 'admin123', 
      role: 'admin', 
      name: 'System Administrator',
      employeeId: 'ADM-001',
      id: '1'
    },
    'agent1': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'John Smith',
      employeeId: 'AGT-001',
      id: '2'
    },
    'agent2': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'Jane Doe',
      employeeId: 'AGT-002',
      id: '3'
    },
    'agent3': { 
      password: 'agent123', 
      role: 'agent', 
      name: 'Mike Johnson',
      employeeId: 'AGT-003',
      id: '4'
    }
  };
  
  const user = users[username];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      message: 'Please check your username and password'
    });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      username,
      role: user.role,
      name: user.name,
      employeeId: user.employeeId
    },
    message: 'Login successful'
  });
});

// ========== ADD THIS: Serve dashboard based on role ==========
app.get('/dashboard', (req, res) => {
  // This would serve different HTML based on user role
  // For now, just return user info
  res.json({
    message: 'Dashboard endpoint',
    user: req.user,
    roleBasedRedirect: req.user.role === 'admin' ? '/admin-dashboard.html' : '/agent-dashboard.html'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WIQ Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      requests: '/api/requests',
      health: '/health',
      login: '/login (POST) - Frontend login endpoint',
      apiLogin: '/api/login (POST) - API login endpoint',
      dashboard: '/dashboard - Get user dashboard info'
    },
    demoCredentials: {
      admin: 'admin / admin123',
      agents: 'agent1/2/3 / agent123'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - UPDATED to include /login endpoint
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/auth', 
      '/api/requests', 
      '/health', 
      '/login (POST)', 
      '/api/login (POST)',
      '/dashboard (GET)'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ WIQ Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend Login: http://localhost:${PORT}/login (POST)`);
  console.log(`🔗 API Login: http://localhost:${PORT}/api/login (POST)`);
  console.log(`🔗 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`🔗 Requests API: http://localhost:${PORT}/api/requests`);
  console.log(`🔗 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`\n📋 Demo credentials:`);
  console.log(`   Admin: username: admin, password: admin123`);
  console.log(`   Agents: username: agent1/2/3, password: agent123`);
});