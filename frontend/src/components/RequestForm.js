import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { requestAPI } from '../services/api';

const RequestForm = ({ requestId, onSuccess, onCancel, userRole }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agents, setAgents] = useState(['Agent 1', 'Agent 2', 'Agent 3']); // Mock agents
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Open',
      assignedAgent: ''
    }
  });

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getById(requestId);
      reset(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch request');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (requestId) {
        await requestAPI.update(requestId, data);
      } else {
        await requestAPI.create(data);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save request');
    } finally {
      setLoading(false);
    }
  };

  if (loading && requestId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {requestId ? 'Edit Request' : 'Create New Request'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required', maxLength: 200 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
              />
            )}
          />

          <Box display="flex" gap={2}>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority">
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Controller
            name="assignedAgent"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Assign Agent</InputLabel>
                <Select {...field} label="Assign Agent">
                  <MenuItem value="">Unassigned</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent} value={agent}>
                      {agent}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default RequestForm;