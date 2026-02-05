import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

const UserSwitch = ({ userRole, onRoleChange }) => {
  return (
    <Box sx={{ minWidth: 120, mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel>User Role</InputLabel>
        <Select
          value={userRole}
          label="User Role"
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="agent">Agent</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Current role: {userRole === 'admin' ? 'Administrator' : 'Agent'}
      </Typography>
    </Box>
  );
};

export default UserSwitch;