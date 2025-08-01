import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton, Paper, Alert, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Dashboard from './Dashboard';
// import Sidebar from './Sidebar';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ brand: '', email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSignup = async () => {
    
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://hubboxbackend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.brand, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoginMode(true);
        setError('Signup successful! Please login.');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://hubboxbackend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setForm({ brand: '', email: '', password: '' });
    setIsLoginMode(false);
    setError('');
  };

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'linear-gradient(90deg, #eafff0 0%, #00e676 100%)',
          background: 'linear-gradient(90deg, #eafff0 0%, #00e676 100%)',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            display: 'flex',
            width: { xs: '95vw', md: 900 },
            minHeight: 500,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* Right Side - Signup/Login Form */}
          <Box
            sx={{
              flex: 1.2,
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Typography variant="h6" color="#00b050" fontWeight={700} mb={1} align="center">
              {isLoginMode ? 'Login to' : 'Get Started with'}
            </Typography>
            <Typography variant="h3" fontWeight={900} mb={2} align="center" sx={{ color: '#00b050', letterSpacing: 1 }}>
              Hub<span style={{ color: '#111' }}>Box</span>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={1} align="center">
              Your videos, your stats, your world.
            </Typography>
            <Typography variant="h5" fontWeight={700} mb={2} align="center">
              {isLoginMode ? 'Login' : 'Sign Up for Free'}
            </Typography>
            {!isLoginMode && (
              <TextField
                label="Channel or Business Name"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={isLoginMode ? 'Password' : 'Create Password'}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Alert severity={error.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{error}</Alert>}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: '#00b050',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                py: 1.2,
                fontSize: 18,
                boxShadow: '0 2px 12px #00b05044',
                '&:hover': { bgcolor: '#00913a' },
              }}
              onClick={isLoginMode ? handleLogin : handleSignup}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isLoginMode ? 'Login' : 'Create My Account')}
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2, color: '#00b050', fontWeight: 700 }}
              onClick={() => {
                setIsLoginMode((prev) => !prev);
                setError('');
              }}
            >
              {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              By continuing, you accept our <span style={{ color: '#00b050', fontWeight: 600 }}>User Policy</span> and <span style={{ color: '#00b050', fontWeight: 600 }}>Privacy Terms</span>.
            </Typography>
          </Box>
          {/* Left Side - Info */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'linear-gradient(135deg, #00e676 0%, #b2ffec 100%)',
              background: 'linear-gradient(135deg, #00e676 0%, #b2ffec 100%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} align="center">
              {isLoginMode ? 'New here?' : 'Already have an account?'}
            </Typography>
            <Typography variant="body1" mb={3} align="center">
              {isLoginMode
                ? 'Sign up to access your dashboard, manage your uploads, and track your growth.'
                : 'Log in to access your dashboard, manage your uploads, and track your growth.'}
            </Typography>
            <Button
              variant="outlined"
              sx={{ color: '#fff', borderColor: '#00b050', fontWeight: 600, borderRadius: 2, px: 4, '&:hover': { bgcolor: '#00b050', borderColor: '#00b050', color: '#fff' } }}
              onClick={() => {
                setIsLoginMode((prev) => !prev);
                setError('');
              }}
            >
              {isLoginMode ? 'Go to Signup' : 'Go to Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
} 