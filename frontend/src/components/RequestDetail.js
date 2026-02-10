import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { requestsAPI, usersAPI } from '../services/api';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: ''
  });
  const [selectedAgent, setSelectedAgent] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isAgent = user.role === 'agent';

  // Mock data for requests
  const getMockRequests = () => ({
    1: {
      id: 1,
      title: 'Database Backup Schedule',
      description: 'Need to set up automated daily backups for the customer database. Currently, we are doing manual backups which is time-consuming and prone to human error. We need an automated solution that runs daily at 2 AM, sends notification on failure, and retains backups for 30 days.',
      priority: 'Medium',
      status: 'Pending',
      createdDate: '2026-02-05T10:30:00Z',
      createdBy: { 
        id: 101, 
        name: 'John Doe', 
        employeeId: 'EMP-101',
        department: 'IT Operations'
      },
      assignedAgent: null,
      comments: [
        {
          id: 1,
          text: 'This is critical for data security. Please prioritize.',
          author: 'John Doe',
          role: 'Requester',
          date: '2026-02-05T11:00:00Z'
        }
      ]
    },
    2: {
      id: 2,
      title: 'New Feature Request - Reports Export',
      description: 'Clients are requesting the ability to export reports in PDF and Excel formats. Currently, reports are only viewable in the browser. This feature would enhance user experience and provide better data portability for our clients.',
      priority: 'Low',
      status: 'Done',
      createdDate: '2026-01-30T14:20:00Z',
      createdBy: { 
        id: 102, 
        name: 'Jane Smith', 
        employeeId: 'EMP-102',
        department: 'Customer Success'
      },
      assignedAgent: { 
        id: 201, 
        name: 'Agent 1', 
        employeeId: 'AGT-001'
      },
      comments: [
        {
          id: 1,
          text: 'Feature implemented successfully.',
          author: 'Agent 1',
          role: 'Agent',
          date: '2026-02-01T09:15:00Z'
        },
        {
          id: 2,
          text: 'Tested and verified. Working as expected.',
          author: 'QA Team',
          role: 'QA',
          date: '2026-02-02T14:30:00Z'
        }
      ]
    },
    3: {
      id: 3,
      title: 'UI Bug Fix - Dashboard',
      description: 'Users are reporting that the dashboard statistics are not updating in real-time. The data appears to be cached and only refreshes after a page reload. This affects the accuracy of displayed metrics for monitoring purposes.',
      priority: 'Medium',
      status: 'In Progress',
      createdDate: '2026-02-06T09:15:00Z',
      createdBy: { 
        id: 103, 
        name: 'Bob Wilson', 
        employeeId: 'EMP-103',
        department: 'Sales'
      },
      assignedAgent: { 
        id: 202, 
        name: 'Agent 2', 
        employeeId: 'AGT-002'
      },
      comments: [
        {
          id: 1,
          text: 'Investigating the caching issue.',
          author: 'Agent 2',
          role: 'Agent',
          date: '2026-02-06T10:30:00Z'
        },
        {
          id: 2,
          text: 'Found the issue in the API response caching.',
          author: 'Agent 2',
          role: 'Agent',
          date: '2026-02-06T15:45:00Z'
        }
      ]
    },
    4: {
      id: 4,
      title: 'Server Maintenance Required',
      description: 'The main production server needs urgent maintenance. Several performance issues have been reported, including slow response times and occasional downtime. Need to schedule maintenance window and apply necessary patches.',
      priority: 'High',
      status: 'Open',
      createdDate: '2026-02-05T11:45:00Z',
      createdBy: { 
        id: 104, 
        name: 'Alice Johnson', 
        employeeId: 'EMP-104',
        department: 'Infrastructure'
      },
      assignedAgent: null,
      comments: [
        {
          id: 1,
          text: 'This is urgent - response times have increased by 300%.',
          author: 'Alice Johnson',
          role: 'Requester',
          date: '2026-02-05T12:00:00Z'
        }
      ]
    },
    5: {
      id: 5,
      title: 'Laptop is lagging',
      description: 'My work laptop keeps freezing and lagging when running multiple applications. It takes several minutes to load basic programs and sometimes crashes entirely. This is severely impacting my productivity.',
      priority: 'High',
      status: 'Pending',
      createdDate: '2026-02-07T08:30:00Z',
      createdBy: { 
        id: 105, 
        name: 'Charlie Brown', 
        employeeId: 'EMP-105',
        department: 'Marketing'
      },
      assignedAgent: null,
      comments: [
        {
          id: 1,
          text: 'Please provide more details about the applications you are running.',
          author: 'IT Support',
          role: 'Support',
          date: '2026-02-07T09:15:00Z'
        }
      ]
    }
  });

  const getMockAgents = () => [
    { id: 201, name: 'Agent 1', employeeId: 'AGT-001' },
    { id: 202, name: 'Agent 2', employeeId: 'AGT-002' },
    { id: 203, name: 'Agent 3', employeeId: 'AGT-003' }
  ];

  useEffect(() => {
    fetchRequestDetails();
    if (isAdmin) {
      fetchAgents();
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load mock data directly
      const mockRequests = getMockRequests();
      const requestId = parseInt(id);
      const mockRequest = mockRequests[requestId];

      if (mockRequest) {
        setRequest(mockRequest);
        setEditData({
          title: mockRequest.title,
          description: mockRequest.description,
          priority: mockRequest.priority
        });
      } else {
        setError('Request not found');
      }
    } catch (err) {
      console.error('Error loading request details:', err);
      setError('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const mockAgents = getMockAgents();
      setAgents(mockAgents);
    } catch (err) {
      console.log('Error loading agents:', err);
      setAgents(getMockAgents());
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const newCommentObj = {
        id: (request.comments?.length || 0) + 1,
        text: newComment,
        author: user.name || 'User',
        role: user.role === 'admin' ? 'Admin' : user.role === 'agent' ? 'Agent' : 'User',
        date: new Date().toISOString()
      };

      setRequest(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newCommentObj]
      }));

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setRequest(prev => ({
        ...prev,
        status: newStatus
      }));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedAgent) return;
    
    try {
      const agent = agents.find(a => a.id === parseInt(selectedAgent));
      
      setRequest(prev => ({
        ...prev,
        assignedAgent: agent
      }));

      setAssignDialogOpen(false);
      setSelectedAgent('');
    } catch (err) {
      console.error('Error assigning agent:', err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setRequest(prev => ({
        ...prev,
        ...editData
      }));

      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Removed loading screen - data loads in background
  if (loading) {
    // Show content immediately, data will populate when ready
  }

  if (error && !request) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Request not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Go Back
        </Button>
      </Container>
    );
  }

  const canEdit = isAdmin || (isAgent && request.assignedAgent?.id === user.id);
  const canAssign = isAdmin;
  const canComment = isAdmin || isAgent || request.createdBy?.id === user.id;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Request Details
        </Typography>
      </Box>

      {/* Request Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Request Details */}
          <Grid item xs={12} md={8}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h5" fontWeight="bold">
                {request.title}
              </Typography>
              {canEdit && (
                <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            
            <Box display="flex" gap={2} mb={2}>
              <Chip 
                label={request.priority} 
                color={getPriorityColor(request.priority)}
              />
              <Chip 
                label={request.status} 
                color={getStatusColor(request.status)}
              />
            </Box>
            
            <Typography variant="body1" paragraph>
              {request.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Request Metadata */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(request.createdDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">
                  {request.createdBy?.name || 'Unknown'}
                </Typography>
                {request.createdBy?.employeeId && (
                  <Typography variant="body2" color="text.secondary">
                    {request.createdBy.employeeId}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {request.createdBy?.department || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Assigned Agent
                </Typography>
                {request.assignedAgent ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                      {request.assignedAgent.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body1">
                      {request.assignedAgent.name}
                    </Typography>
                    {canAssign && (
                      <IconButton size="small" onClick={() => setAssignDialogOpen(true)}>
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" color="text.secondary">
                      Not assigned
                    </Typography>
                    {canAssign && (
                      <IconButton size="small" onClick={() => setAssignDialogOpen(true)}>
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Request ID
                </Typography>
                <Typography variant="body1">
                  REQ-{String(request.id).padStart(4, '0')}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={request.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={!canEdit}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Right Column - Actions */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  {isAdmin && request.status === 'Pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleUpdateStatus('Open')}
                        fullWidth
                      >
                        Approve Request
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleUpdateStatus('Rejected')}
                        fullWidth
                      >
                        Reject Request
                      </Button>
                    </>
                  )}
                  
                  {canAssign && (
                    <Button
                      variant="outlined"
                      startIcon={<AssignmentIcon />}
                      onClick={() => setAssignDialogOpen(true)}
                      fullWidth
                    >
                      {request.assignedAgent ? 'Reassign Agent' : 'Assign Agent'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Comments Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments ({request.comments?.length || 0})
        </Typography>
        
        {/* Add Comment Form */}
        {canComment && (
          <Box mb={3}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                sx={{ alignSelf: 'flex-end' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : <SendIcon />}
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Comments List */}
        {request.comments && request.comments.length > 0 ? (
          <List>
            {request.comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {comment.author.charAt(0)}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.date)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {comment.role}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {comment.text}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" align="center" py={4}>
            No comments yet. {canComment ? 'Be the first to comment!' : ''}
          </Typography>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Request</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editData.priority}
                label="Priority"
                onChange={(e) => setEditData({...editData, priority: e.target.value})}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Agent to Request</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography gutterBottom>
              <strong>Request:</strong> {request.title}
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
    </Container>
  );
};

export default RequestDetail;