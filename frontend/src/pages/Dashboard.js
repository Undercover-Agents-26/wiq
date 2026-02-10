
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RequestForm from '../components/RequestForm';
import RequestDetail from '../components/RequestDetail';
import { requestsAPI, authAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('updatedDate');
  
  // Modals
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchData();
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
      handleLogout();
    }
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, search, statusFilter, priorityFilter, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const meResponse = await authAPI.getMe();
      setUser(meResponse.data);
      localStorage.setItem('user', JSON.stringify(meResponse.data));
      
      const [requestsRes, statsRes, agentsRes] = await Promise.all([
        requestsAPI.getAll({ sortBy }),
        requestsAPI.getStats(),
        requestsAPI.getAgents()
      ]);
      
      setRequests(requestsRes.data);
      setStats(statsRes.data);
      setAgents(agentsRes.data);
      filterRequests(requestsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.response?.data?.error || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = (requestList = requests) => {
    let filtered = [...requestList];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    if (priorityFilter) {
      filtered = filtered.filter(r => r.priority === priorityFilter);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'updatedDate') {
        return new Date(b.updatedDate) - new Date(a.updatedDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'createdDate') {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });
    
    setFilteredRequests(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowDetail(true);
  };

  const handleRequestSuccess = () => {
    fetchData();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Open': return 'info';
      case 'In Progress': return 'primary';
      case 'Done': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">
          User not found. Redirecting to login...
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {/* Small WIQ Logo in Header */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="40" viewBox="0 0 1400 500" xmlns="http://www.w3.org/2000/svg">
                <polygon 
                  points="100,100 200,400 280,200 360,400 460,100 380,100 280,320 200,100" 
                  fill="#003d7a"
                />
                <polygon 
                  points="200,100 280,200 280,320 200,400" 
                  fill="#ffd700"
                  opacity="0.7"
                />
                <polygon 
                  points="380,80 450,180 420,180 480,280 400,200 430,200" 
                  fill="#ffd700"
                />
                <text 
                  x="550" 
                  y="320" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="280" 
                  fontWeight="bold" 
                  fill="#003d7a"
                >
                  WIQ
                </text>
              </svg>
            </Box>
            
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Work Intelligence Queue
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {user.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip 
                  label={user.role === 'admin' ? 'Administrator' : 'Agent'} 
                  color={user.role === 'admin' ? 'primary' : 'secondary'}
                  size="small"
                />
                <Chip 
                  label={`ID: ${user.employeeId}`}
                  variant="outlined"
                  size="small"
                  icon={<PersonIcon />}
                />
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" gap={2}>
            {user.role === 'agent' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowRequestForm(true)}
              >
                New Request
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats?.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats?.pending || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main" gutterBottom>
                {stats?.open || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main" gutterBottom>
                {stats?.byPriority?.High || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All Priority</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="updatedDate">Last Updated</MenuItem>
              <MenuItem value="createdDate">Created Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setPriorityFilter('');
              setSortBy('updatedDate');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No requests found. {user.role === 'agent' ? 'Create your first request!' : 'No requests available.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {request.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.description?.substring(0, 60) || 'No description'}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.priority} 
                      size="small" 
                      color={getPriorityColor(request.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      size="small" 
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {request.createdBy?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {request.assignedAgent?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {request.createdDate ? new Date(request.createdDate).toLocaleDateString() : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewRequest(request)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRequests.length} of {requests.length} requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>

      {/* Request Form Modal */}
      {user.role === 'agent' && (
        <RequestForm
          open={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
          user={user}
        />
      )}

      {/* Request Detail Modal */}
      <Dialog 
        open={showDetail} 
        onClose={() => setShowDetail(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <RequestDetail
            request={selectedRequest}
            user={user}
            agents={agents}
            onUpdate={() => {
              fetchData();
              setShowDetail(false);
            }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard;