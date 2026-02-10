
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';

// Mock data - will be replaced with API calls
const getMockRequests = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentAgentId = user.id || 201; // Default to agent ID 201 for mock data
  
  return [
    {
      id: 1,
      title: 'Database Backup Schedule',
      description: 'Need to set up automated daily backups for the customer data...',
      priority: 'Medium',
      status: 'Pending',
      createdDate: '2026-02-05',
      createdBy: { id: 101, name: 'John Doe', employeeId: 'EMP-101' },
      assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
      assignedToMe: true,
      editable: true,
      comments: []
    },
    {
      id: 2,
      title: 'New Feature Request - Reports Export',
      description: 'Clients requesting ability to export reports in PDF and Excel...',
      priority: 'Low',
      status: 'Done',
      createdDate: '2026-01-30',
      createdBy: { id: 102, name: 'Jane Smith', employeeId: 'EMP-102' },
      assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
      assignedToMe: true,
      editable: false,
      comments: []
    },
    {
      id: 3,
      title: 'UI Bug Fix - Dashboard',
      description: 'Users reporting that the dashboard statistics are not updated...',
      priority: 'Medium',
      status: 'In Progress',
      createdDate: '2026-02-06',
      createdBy: { id: 103, name: 'Bob Wilson', employeeId: 'EMP-103' },
      assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
      assignedToMe: true,
      editable: true,
      comments: [
        { id: 1, text: 'Working on the fix', author: 'Agent', date: '2026/02/06' }
      ]
    },
    {
      id: 4,
      title: 'Server Maintenance Required',
      description: 'The main production server needs urgent maintenance. Several...',
      priority: 'High',
      status: 'Open',
      createdDate: '2026-02-05',
      createdBy: { id: 104, name: 'Alice Johnson', employeeId: 'EMP-104' },
      assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
      assignedToMe: true,
      editable: true,
      comments: []
    },
    {
      id: 5,
      title: 'Laptop is lagging',
      description: 'It keeps loading over again with the same error...',
      priority: 'High',
      status: 'Pending',
      createdDate: 'Unknown',
      createdBy: { id: 105, name: 'Charlie Brown', employeeId: 'EMP-105' },
      assignedAgent: { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
      assignedToMe: true,
      editable: false,
      comments: []
    }
  ].filter(req => req.assignedAgent.id === currentAgentId);
};

function AgentDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try API first (commented out for now)
      // const response = await requestsAPI.getAssigned();
      // setRequests(response.data.requests || []);
      
      // Fallback to mock data
      setTimeout(() => {
        const mockData = getMockRequests();
        setRequests(mockData);
        setLoading(false);
      }, 500); // Simulate API delay
      
    } catch (error) {
      console.log('Using mock data:', error);
      const mockData = getMockRequests();
      setRequests(mockData);
      setLoading(false);
    }
  };

  // Filter requests based on assignedToMe (agents only see assigned requests)
  const assignedRequests = requests.filter(req => req.assignedToMe);

  // Stats calculation
  const myRequestsCount = assignedRequests.length;
  const inProgressCount = assignedRequests.filter(req => req.status === 'In Progress').length;
  const completedCount = assignedRequests.filter(req => req.status === 'Done').length;
  const pendingCount = assignedRequests.filter(req => req.status === 'Pending').length;

  // Filter requests based on search and filters
  const filteredRequests = assignedRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle edit
  const handleEdit = (request) => {
    if (!request.editable) {
      setSnackbar({
        open: true,
        message: 'This request is not editable',
        severity: 'warning'
      });
      return;
    }
    
    setEditingId(request.id);
    setEditForm({
      priority: request.priority,
      status: request.status
    });
  };

  // Handle save
  const handleSave = (id) => {
    const request = requests.find(req => req.id === id);
    if (!request || !request.editable) {
      setSnackbar({
        open: true,
        message: 'Cannot update this request',
        severity: 'error'
      });
      return;
    }

    const updatedRequests = requests.map(req => 
      req.id === id 
        ? { ...req, ...editForm }
        : req
    );

    setRequests(updatedRequests);
    setEditingId(null);
    
    setSnackbar({
      open: true,
      message: 'Request updated successfully!',
      severity: 'success'
    });
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Handle add comment
  const handleAddComment = (requestId) => {
    setSelectedRequestId(requestId);
    setCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
    setNewComment('');
    setSelectedRequestId(null);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a comment',
        severity: 'error'
      });
      return;
    }

    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequestId) {
        const comments = req.comments || [];
        return {
          ...req,
          comments: [
            ...comments,
            {
              id: comments.length + 1,
              text: newComment,
              author: user.name || 'Agent',
              date: new Date().toLocaleDateString()
            }
          ]
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    setSnackbar({
      open: true,
      message: 'Comment added successfully!',
      severity: 'success'
    });
    handleCloseCommentDialog();
  };

  // Handle view details (navigate to RequestDetail page)
  const handleViewDetails = (requestId) => {
    console.log('Navigating to request:', requestId);
    navigate(`/request/${requestId}`);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Done': return 'success';
      case 'Open': return 'primary';
      default: return 'default';
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setStatusFilter('all');
    } else if (newValue === 1) {
      setStatusFilter('Pending');
    } else if (newValue === 2) {
      setStatusFilter('In Progress');
    } else if (newValue === 3) {
      setStatusFilter('Done');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Agent Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {user.name || 'John Smith'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Employee ID: {user.employeeId || 'AGT-001'}
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Assigned to Me
              </Typography>
              <Typography variant="h4">
                {myRequestsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">
                {inProgressCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">
                {completedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for filtering by status */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Requests" />
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search requests by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Priority</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Created Date</b></TableCell>
              <TableCell><b>Comments</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No requests assigned to you
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {editingId === request.id ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={editForm.priority}
                          onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                        >
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={request.priority} 
                        color={getPriorityColor(request.priority)}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === request.id ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Done">Done</MenuItem>
                          <MenuItem value="Open">Open</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{request.createdDate}</TableCell>
                  <TableCell>
                    <Badge 
                      badgeContent={request.comments?.length || 0} 
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      <AddCommentIcon color="action" />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editingId === request.id ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleSave(request.id)}
                              disabled={!request.editable}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton 
                              color="secondary" 
                              size="small"
                              onClick={handleCancel}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Update Status">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleEdit(request)}
                              disabled={!request.editable}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Comment">
                            <IconButton 
                              color="info" 
                              size="small"
                              onClick={() => handleAddComment(request.id)}
                            >
                              <AddCommentIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton 
                              color="default" 
                              size="small"
                              onClick={() => handleViewDetails(request.id)}
                            >
                              <VisibilityIcon />
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

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={handleCloseCommentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommentDialog}>Cancel</Button>
          <Button onClick={handleSubmitComment} variant="contained">
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AgentDashboard;