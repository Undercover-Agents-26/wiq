import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Pages
import Dashboard from './pages/Dashboard';
import RequestDetail from './pages/RequestDetail';
import RequestForm from './components/RequestForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/request/:id" element={<RequestDetail />} />
            <Route path="/create" element={<RequestFormWrapper />} />
            <Route path="/edit/:id" element={<RequestFormWrapper edit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

function RequestFormWrapper({ edit }) {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <RequestForm
        requestId={edit ? window.location.pathname.split('/').pop() : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        userRole="admin"
      />
    </Container>
  );
}

export default App;