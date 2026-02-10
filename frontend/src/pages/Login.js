import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the mock API from services/api.js
      const response = await usersAPI.login(credentials);
      const { success, user, message } = response.data;
      
      if (success && user) {
        // Store user info
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate to dashboard based on role
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/agent-dashboard');
        }
      } else {
        throw new Error(message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Show specific error message
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.message || 
                      err.message || 
                      'Login failed. Please check your credentials and try again.';
      
      setError(errorMsg);
      
      // Clear any invalid stored data
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Demo credentials helper
  const useDemoCredentials = (username) => {
    setCredentials({
      username,
      password: username === 'admin' ? 'admin123' : 'agent123'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            WIQ System Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Work Intelligence Queue Management System
          </Typography>
        </Box>

        <Card sx={{ mb: 3, bgcolor: 'info.light' }}>
          <CardContent>
            <Typography variant="body2">
              <strong>Demo Credentials:</strong>
            </Typography>
            <Typography variant="body2">
              Admin: username: admin, password: admin123
            </Typography>
            <Typography variant="body2">
              Agents: username: agent1/2/3, password: agent123
            </Typography>
            
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                <strong>Quick Login:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => useDemoCredentials('admin')}
                >
                  Login as Admin
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => useDemoCredentials('agent1')}
                >
                  Login as Agent 1
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => useDemoCredentials('agent2')}
                >
                  Login as Agent 2
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => useDemoCredentials('agent3')}
                >
                  Login as Agent 3
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
        
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Note: Using mock authentication. Working offline.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;