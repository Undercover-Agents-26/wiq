import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { requestAPI } from '../services/api';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getById(id);
      setRequest(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await requestAPI.update(id, { status: newStatus });
      fetchRequest(); // Refresh data
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAgentChange = async (agent) => {
    try {
      await requestAPI.update(id, { assignedAgent: agent });
      fetchRequest();
    } catch (err) {
      setError('Failed to update agent');
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await requestAPI.addComment(id, {
        text: comment,
        author: 'Current User' // Replace with actual user
      });
      setComment('');
      fetchRequest();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container>
        <Alert severity="warning">
          Request not found
        </Alert>
      </Container>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {request.title}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {request.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Comments */}
            <Typography variant="h6" gutterBottom>
              Comments ({request.comments?.length || 0})
            </Typography>
            
            <List>
              {request.comments?.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(comment.timestamp), 'MMM dd, HH:mm')}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.text}
                  />
                </ListItem>
              ))}
            </List>

            {/* Add Comment */}
            <Box display="flex" gap={1} mt={2}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submittingComment}
              />
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                disabled={submittingComment || !comment.trim()}
                sx={{ alignSelf: 'flex-end' }}
              >
                {submittingComment ? <CircularProgress size={24} /> : <SendIcon />}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Metadata */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            {/* Status */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={request.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Priority */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Priority
              </Typography>
              <Chip 
                label={request.priority} 
                color={getPriorityColor(request.priority)}
                size="medium"
              />
            </Box>

            {/* Assigned Agent */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assigned Agent
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={request.assignedAgent || ''}
                  onChange={(e) => handleAgentChange(e.target.value)}
                >
                  <MenuItem value="">Unassign</MenuItem>
                  <MenuItem value="Agent 1">Agent 1</MenuItem>
                  <MenuItem value="Agent 2">Agent 2</MenuItem>
                  <MenuItem value="Agent 3">Agent 3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Dates */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dates
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  Created: {format(new Date(request.createdDate), 'MMM dd, yyyy HH:mm')}
                </Typography>
                <Typography variant="body2">
                  Updated: {format(new Date(request.updatedDate), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RequestDetail;