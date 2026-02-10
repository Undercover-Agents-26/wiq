import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  TableSortLabel,
  InputAdornment,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar
} from '@mui/material';
import {
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { requestsAPI, usersAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    open: 0,
    inProgress: 0,
    done: 0,
    agents: 0
  });
  
  // Modal states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [manageAgentsDialogOpen, setManageAgentsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [tabValue, setTabValue] = useState(0);
  
  // Form states
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedAgentId: ''
  });
  
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: ''
  });
  
  const [newComment, setNewComment] = useState('');

  const statusOptions = ['Pending', 'Open', 'In Progress', 'Done', 'Rejected'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(savedUser);
      if (userData.role !== 'admin') {
        navigate('/agent-dashboard');
        return;
      }
      setUser(userData);
      fetchData();
    } catch (error) {
      handleLogout();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data if API is not available
      // In production, uncomment the API calls
      
      // Try to fetch from API
      try {
        // const [pendingRes, allRequestsRes, agentsRes, statsRes] = await Promise.all([
        //   requestsAPI.getAll({ status: 'Pending' }),
        //   requestsAPI.getAll(),
        //   usersAPI.getAgents(),
        //   statsAPI.getDashboardStats()
        // ]);
        
        // setPendingRequests(pendingRes.data.requests || []);
        // setAllRequests(allRequestsRes.data.requests || []);
        // setAgents(agentsRes.data.agents || []);
        // setStats(statsRes.data || {
        //   total: allRequestsRes.data.requests?.length || 0,
        //   pending: pendingRes.data.requests?.length || 0,
        //   open: allRequestsRes.data.requests?.filter(r => r.status === 'Open').length || 0,
        //   inProgress: allRequestsRes.data.requests?.filter(r => r.status === 'In Progress').length || 0,
        //   done: allRequestsRes.data.requests?.filter(r => r.status === 'Done').length || 0,
        //   agents: agentsRes.data.agents?.length || 0
        // });
        
        // For now, use mock data
        await loadMockData();
        
      } catch (apiError) {
        console.log('Using mock data due to API error:', apiError);
        await loadMockData();
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = async () => {
    // Mock data
    const mockRequests = [
      {
        id: 1,
        title: 'Database Backup Schedule',
        description: 'Need to set up automated daily backups for the customer data...',
        priority: 'Medium',
        status: 'Pending',
        createdDate: '2026-02-05T10:30:00Z',
        createdBy: { id: 101, name: 'John Doe', employeeId: 'EMP-101' },
        assignedAgent: null,
        comments: []
      },
      {
        id: 2,
        title: 'New Feature Request - Reports Export',
        description: 'Clients requesting ability to export reports in PDF and Excel...',
        priority: 'Low',
        status: 'Done',
        createdDate: '2026-01-30T14:20:00Z',
        createdBy: { id: 102, name: 'Jane Smith', employeeId: 'EMP-102' },
        assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
        comments: []
      },
      {
        id: 3,
        title: 'UI Bug Fix - Dashboard',
        description: 'Users reporting that the dashboard statistics are not updated...',
        priority: 'Medium',
        status: 'In Progress',
        createdDate: '2026-02-06T09:15:00Z',
        createdBy: { id: 103, name: 'Bob Wilson', employeeId: 'EMP-103' },
        assignedAgent: { id: 202, name: 'Agent 2', employeeId: 'AGT-002' },
        comments: []
      },
      {
        id: 4,
        title: 'Server Maintenance Required',
        description: 'The main production server needs urgent maintenance. Several...',
        priority: 'High',
        status: 'Open',
        createdDate: '2026-02-05T11:45:00Z',
        createdBy: { id: 104, name: 'Alice Johnson', employeeId: 'EMP-104' },
        assignedAgent: null,
        comments: []
      },
      {
        id: 5,
        title: 'Laptop is lagging',
        description: 'It keeps loading over again with the same error...',
        priority: 'High',
        status: 'Pending',
        createdDate: '2026-02-07T08:30:00Z',
        createdBy: { id: 105, name: 'Charlie Brown', employeeId: 'EMP-105' },
        assignedAgent: null,
        comments: []
      }
    ];

    const mockAgents = [
      { id: 201, name: 'Agent 1', email: 'agent1@company.com', employeeId: 'AGT-001', role: 'agent' },
      { id: 202, name: 'Agent 2', email: 'agent2@company.com', employeeId: 'AGT-002', role: 'agent' },
      { id: 203, name: 'Agent 3', email: 'agent3@company.com', employeeId: 'AGT-003', role: 'agent' }
    ];

    setPendingRequests(mockRequests.filter(r => r.status === 'Pending'));
    setAllRequests(mockRequests);
    setAgents(mockAgents);
    
    // Calculate stats
    setStats({
      total: mockRequests.length,
      pending: mockRequests.filter(r => r.status === 'Pending').length,
      open: mockRequests.filter(r => r.status === 'Open').length,
      inProgress: mockRequests.filter(r => r.status === 'In Progress').length,
      done: mockRequests.filter(r => r.status === 'Done').length,
      agents: mockAgents.length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleApprove = async (requestId) => {
    try {
      // Mock API call
      const request = allRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'Open';
        setAllRequests([...allRequests]);
        setPendingRequests(allRequests.filter(r => r.status === 'Pending'));
        
        setSuccess('Request approved successfully!');
        setApproveDialogOpen(false);
        setSelectedRequest(null);
        
        // Recalculate stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          open: prev.open + 1
        }));
      }
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      // Mock API call
      const request = allRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'Rejected';
        setAllRequests([...allRequests]);
        setPendingRequests(allRequests.filter(r => r.status === 'Pending'));
        
        setSuccess('Request rejected successfully!');
        
        // Recalculate stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1
        }));
      }
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedRequest || !selectedAgent) return;
    
    try {
      // Mock API call
      const request = allRequests.find(r => r.id === selectedRequest.id);
      const agent = agents.find(a => a.id === parseInt(selectedAgent));
      
      if (request && agent) {
        request.assignedAgent = agent;
        setAllRequests([...allRequests]);
        
        setSuccess(`Request assigned to ${agent.name} successfully!`);
        setAssignDialogOpen(false);
        setSelectedRequest(null);
        setSelectedAgent('');
      }
    } catch (err) {
      setError('Failed to assign agent');
    }
  };

  const handleCreateRequest = async () => {
    try {
      // Create new request with mock data
      const newRequestObj = {
        id: allRequests.length + 1,
        title: newRequest.title,
        description: newRequest.description,
        priority: newRequest.priority,
        status: 'Pending',
        createdDate: new Date().toISOString(),
        createdBy: user,
        assignedAgent: newRequest.assignedAgentId ? 
          agents.find(a => a.id === parseInt(newRequest.assignedAgentId)) : null,
        comments: []
      };

      setAllRequests([newRequestObj, ...allRequests]);
      setPendingRequests([newRequestObj, ...pendingRequests]);
      
      // Reset form
      setNewRequest({
        title: '',
        description: '',
        priority: 'Medium',
        assignedAgentId: ''
      });
      
      setNewRequestDialogOpen(false);
      setSuccess('Request created successfully!');
      
      // Recalculate stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));
      
    } catch (err) {
      setError('Failed to create request');
    }
  };

  const handleAddAgent = async () => {
    try {
      if (!newAgent.name || !newAgent.email || !newAgent.employeeId || !newAgent.password) {
        setError('Please fill in all required fields');
        return;
      }

      // Create new agent with mock data
      const newAgentObj = {
        id: agents.length + 1,
        name: newAgent.name,
        email: newAgent.email,
        employeeId: newAgent.employeeId,
        role: 'agent'
      };

      setAgents([...agents, newAgentObj]);
      
      // Reset form
      setNewAgent({
        name: '',
        email: '',
        employeeId: '',
        password: ''
      });
      
      setSuccess('Agent added successfully!');
      
      // Recalculate stats
      setStats(prev => ({
        ...prev,
        agents: prev.agents + 1
      }));
      
    } catch (err) {
      setError('Failed to add agent');
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      // Remove agent from mock data
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      setAgents(updatedAgents);
      
      // Also remove agent assignment from requests
      const updatedRequests = allRequests.map(request => {
        if (request.assignedAgent?.id === agentId) {
          return { ...request, assignedAgent: null };
        }
        return request;
      });
      
      setAllRequests(updatedRequests);
      setPendingRequests(updatedRequests.filter(r => r.status === 'Pending'));
      
      setSuccess('Agent deleted successfully!');
      
      // Recalculate stats
      setStats(prev => ({
        ...prev,
        agents: prev.agents - 1
      }));
      
    } catch (err) {
      setError('Failed to delete agent');
    }
  };

  const handleAddComment = async () => {
    if (!selectedRequest || !newComment.trim()) return;
    
    try {
      // Mock API call
      const request = allRequests.find(r => r.id === selectedRequest.id);
      if (request) {
        if (!request.comments) request.comments = [];
        request.comments.push({
          id: request.comments.length + 1,
          text: newComment,
          author: user.name,
          date: new Date().toISOString()
        });
        
        setAllRequests([...allRequests]);
        setSuccess('Comment added successfully!');
        setCommentDialogOpen(false);
        setNewComment('');
        setSelectedRequest(null);
      }
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleRemoveAgentFromRequest = async (requestId) => {
    try {
      // Mock API call
      const request = allRequests.find(r => r.id === requestId);
      if (request) {
        request.assignedAgent = null;
        setAllRequests([...allRequests]);
        setSuccess('Agent removed from request successfully!');
      }
    } catch (err) {
      setError('Failed to remove agent');
    }
  };

  const handleViewRequest = (request) => {
    console.log('Navigating to request:', request.id);
    navigate(`/request/${request.id}`);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedAndFilteredRequests = allRequests
    .filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (request.createdBy?.name && request.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(request.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(request.priority);
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortField === 'createdDate') {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return sortDirection === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

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
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setStatusFilter([]);
    } else if (newValue === 1) {
      setStatusFilter(['Pending']);
    } else if (newValue === 2) {
      setStatusFilter(['Open', 'In Progress']);
    } else if (newValue === 3) {
      setStatusFilter(['Done', 'Rejected']);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome, {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employee ID: {user.employeeId}
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewRequestDialogOpen(true)}
            >
              New Request
            </Button>
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

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

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
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats?.agents || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Agents
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
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Requests" />
          <Tab label="Pending Approval" />
          <Tab label="Active Requests" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search requests by title, description, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                multiple
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                input={<OutlinedInput label="Filter by Status" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={statusFilter.indexOf(status) > -1} />
                    <ListItemText primary={status} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Priority</InputLabel>
              <Select
                multiple
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                input={<OutlinedInput label="Filter by Priority" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Checkbox checked={priorityFilter.indexOf(priority) > -1} />
                    <ListItemText primary={priority} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* All Requests Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            All Requests ({sortedAndFilteredRequests.length})
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setManageAgentsDialogOpen(true)}
          >
            Manage Agents
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'createdDate'}
                    direction={sortField === 'createdDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('createdDate')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'priority'}
                    direction={sortField === 'priority' ? sortDirection : 'asc'}
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      {formatDate(request.createdDate)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {request.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.description?.substring(0, 60)}...
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
                      <Typography variant="body2">
                        {request.createdBy?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.createdBy?.employeeId || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {request.assignedAgent ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={request.assignedAgent.name}
                            size="small"
                            variant="outlined"
                          />
                          <Tooltip title="Remove Agent">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveAgentFromRequest(request.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Tooltip title="Assign Agent">
                          <IconButton 
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAssignDialogOpen(true);
                            }}
                          >
                            <AssignmentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={() => handleViewRequest(request)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Add Comment">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedRequest(request);
                              setCommentDialogOpen(true);
                            }}
                          >
                            <CommentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {request.status === 'Pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton 
                                size="small"
                                color="success"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setApproveDialogOpen(true);
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Reject">
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleReject(request.id)}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Approve Request Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography gutterBottom>
                <strong>Title:</strong> {selectedRequest.title}
              </Typography>
              <Typography gutterBottom>
                <strong>Description:</strong> {selectedRequest.description}
              </Typography>
              <Typography gutterBottom>
                <strong>Priority:</strong> {selectedRequest.priority}
              </Typography>
              <Typography>
                <strong>Created by:</strong> {selectedRequest.createdBy?.name}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleApprove(selectedRequest?.id)}
          >
            Approve Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Agent to Request</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography gutterBottom>
              <strong>Request:</strong> {selectedRequest?.title}
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Agent</InputLabel>
              <Select
                value={selectedAgent}
                label="Select Agent"
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.employeeId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAssignAgent}
            disabled={!selectedAgent}
          >
            Assign Agent
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Request Dialog */}
      <Dialog open={newRequestDialogOpen} onClose={() => setNewRequestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Request</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title *"
              fullWidth
              value={newRequest.title}
              onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              label="Description *"
              fullWidth
              multiline
              rows={4}
              value={newRequest.description}
              onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority *</InputLabel>
              <Select
                value={newRequest.priority}
                label="Priority *"
                onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                required
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign to Agent (Optional)</InputLabel>
              <Select
                value={newRequest.assignedAgentId}
                label="Assign to Agent (Optional)"
                onChange={(e) => setNewRequest({...newRequest, assignedAgentId: e.target.value})}
              >
                <MenuItem value="">None</MenuItem>
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.employeeId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewRequestDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateRequest}
            disabled={!newRequest.title || !newRequest.description}
          >
            Create Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography gutterBottom>
              <strong>Request:</strong> {selectedRequest?.title}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Your Comment"
              fullWidth
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Agents Dialog */}
      <Dialog open={manageAgentsDialogOpen} onClose={() => setManageAgentsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Agents</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Agent
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name *"
                  fullWidth
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email *"
                  fullWidth
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee ID *"
                  fullWidth
                  value={newAgent.employeeId}
                  onChange={(e) => setNewAgent({...newAgent, employeeId: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password *"
                  fullWidth
                  type="password"
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({...newAgent, password: e.target.value})}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleAddAgent}
                  disabled={!newAgent.name || !newAgent.email || !newAgent.employeeId || !newAgent.password}
                >
                  Add Agent
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Current Agents ({agents.length})
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.employeeId}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete Agent">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManageAgentsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;