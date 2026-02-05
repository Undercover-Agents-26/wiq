import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserSwitch from '../components/UserSwitch';
import RequestList from '../components/RequestList';
import { requestAPI } from '../services/api';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('admin');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await requestAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setStatsError('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handleViewRequest = (id) => {
    navigate(`/request/${id}`);
  };

  const handleEditRequest = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            WIQ - Work Intelligence Queue
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage work requests efficiently
          </Typography>
        </Box>
        <UserSwitch userRole={userRole} onRoleChange={setUserRole} />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AssignmentIcon color="primary" />
                <Box>
                  <Typography variant="h6">
                    {statsLoading ? '...' : stats?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Requests
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ScheduleIcon color="warning" />
                <Box>
                  <Typography variant="h6">
                    {statsLoading ? '...' : stats?.byStatus?.['In Progress'] || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon color="success" />
                <Box>
                  <Typography variant="h6">
                    {statsLoading ? '...' : stats?.byStatus?.Done || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip label="High" color="error" size="small" />
                <Box>
                  <Typography variant="h6">
                    {statsLoading ? '...' : stats?.byPriority?.High || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Work Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          New Request
        </Button>
      </Box>

      {/* Requests List */}
      <RequestList
        onView={handleViewRequest}
        onEdit={handleEditRequest}
        userRole={userRole}
      />
    </Container>
  );
};

export default Dashboard;