import React, { useEffect, useState } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Button, Avatar, useMediaQuery, Divider, Paper, Grid, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShareIcon from '@mui/icons-material/Share';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const drawerWidth = 240;

const user = { name: 'ak editz', email: 'ak7477586@gmail.com' };

// Deep linking utility functions
const openInApp = (videoId) => {
  // Use the correct format from your app
  const deepLink = `hubbox://video/${videoId}`;
  const httpsLink = `https://hubboxbackend.onrender.com/hubbox/v/${videoId}`;
  const webLink = `https://hubboxbackend.onrender.com/api/video/v/${videoId}`;
  
  // Try deep link first
  window.location.href = deepLink;
  
  // Fallback to HTTPS link after 1 second
  setTimeout(() => {
    window.location.href = httpsLink;
  }, 1000);
  
  // Final fallback to web after 2 seconds
  setTimeout(() => {
    window.location.href = webLink;
  }, 2000);
};

const copyDeepLink = (videoId) => {
  // Use the correct format from your app
  const deepLink = `hubbox://video/${videoId}`;
  navigator.clipboard.writeText(deepLink);
  return 'Deep link copied to clipboard!';
};

// Function to create shareable link that opens in app
const createShareableLink = (videoId) => {
  return `hubbox://video/${videoId}`;
};

const menuItems = [
  { text: 'Revenue Data', icon: <AttachMoneyIcon sx={{ color: '#00b050' }} /> },
  { text: 'Link Data', icon: <LinkIcon sx={{ color: '#00b050' }} /> },
  { text: 'My file', icon: <FolderIcon sx={{ color: '#00b050' }} /> },
  { text: 'Withdraw', icon: <AccountBalanceWalletIcon sx={{ color: '#00b050' }} /> },
];

// Dummy data for earnings table
const earningsData = [
  // Uncomment below to test with data
  // { date: '2024-05-20', total: 2.50, views: 1250, earning: 2.50 },
  // { date: '2024-05-19', total: 1.00, views: 500, earning: 1.00 },
];

function RevenueDataSection() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [stats, setStats] = useState({ views: 0, earning: 0 });

  useEffect(() => {
    // Get user email from JWT token in localStorage
    const token = localStorage.getItem('token');
    if (!token) return;
    // Decode JWT to get email (simple base64 decode, not secure for prod)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email;
      fetch('https://hubboxbackend.onrender.com/api/analytics/all-users')
        .then(res => res.json())
        .then(users => {
          if (Array.isArray(users)) {
            const user = users.find(u => u.email === email);
            if (user) setStats({ views: user.views || 0, earning: user.earning || 0 });
          }
        });
    } catch (e) {}
  }, []);

  return (
    <Box>
      {/* Welcome Message */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, background: 'linear-gradient(135deg, #00e676 0%, #b2ffec 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <EmojiEventsIcon sx={{ fontSize: 40, color: '#fff' }} />
          <Box>
            <Typography variant="h5" fontWeight={700} color="#fff">
              Welcome back! 🎉
            </Typography>
            <Typography variant="body1" color="#fff" sx={{ opacity: 0.9 }}>
              Ready to grow your earnings today?
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<TrendingUpIcon />} 
            label="Share videos to earn" 
            sx={{ bgcolor: '#fff', color: '#00b050', fontWeight: 600 }}
          />
          <Chip 
            icon={<AttachMoneyIcon />} 
            label="Track your progress" 
            sx={{ bgcolor: '#fff', color: '#00b050', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Earnings summary cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: '2px solid #e8f5e8' }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: '#00b050', mb: 1 }} />
            <Typography variant="h6" fontWeight={700} color="#00b050">Total Earnings</Typography>
            <Typography variant="h4" fontWeight={900} color="#00b050">${stats.earning.toFixed(2)}</Typography>
            <Typography variant="caption" color="text.secondary">All time earnings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: '2px solid #f3e8ff' }}>
            <LinkIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
            <Typography variant="h6" fontWeight={700} color="#7c3aed">Total Views</Typography>
            <Typography variant="h4" fontWeight={900} color="#7c3aed">{stats.views.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">All time views</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: '2px solid #e8f5e8' }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#00b050', mb: 1 }} />
            <Typography variant="h6" fontWeight={700} color="#00b050">Withdrawn</Typography>
            <Typography variant="h4" fontWeight={900} color="#00b050">$0.00</Typography>
            <Typography variant="caption" color="text.secondary">Total withdrawn</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Revenue Table or No Data State */}
      <Paper elevation={2} sx={{ p: isMobile ? 1 : 3, borderRadius: 3, mb: 2 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Revenue</Typography>
        {stats.views === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ShareIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>No earnings yet</Typography>
            <Typography color="text.secondary" mb={3}>Start sharing videos to earn money</Typography>
            <Button 
              variant="contained" 
              startIcon={<ShareIcon />} 
              sx={{ 
                bgcolor: '#00b050', 
                borderRadius: 8, 
                fontWeight: 700, 
                px: 4, 
                py: 1.5, 
                fontSize: 16, 
                boxShadow: '0 4px 20px #00b05044', 
                '&:hover': { 
                  bgcolor: '#00913a',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px #00b05066'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Sharing Videos
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography color="text.secondary" mb={2}>
              You have <strong>{stats.views.toLocaleString()}</strong> views. Your earning: <strong>${stats.earning.toFixed(2)}</strong>
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<ShareIcon />} 
              sx={{ 
                borderColor: '#00b050', 
                color: '#00b050', 
                borderRadius: 8, 
                fontWeight: 600, 
                px: 3, 
                py: 1,
                '&:hover': { 
                  bgcolor: '#00b050', 
                  color: '#fff',
                  borderColor: '#00b050'
                }
              }}
            >
              Share More Videos
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

function LinkDataSection() {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={1}>Shared link</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Only display the top 10 items with the highest number of views. Shared links start counting from May 13, 2024
      </Typography>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#fafbfc' }}>
        <Typography color="text.secondary">No Data</Typography>
      </Paper>
    </Paper>
  );
}

function MyFileSection() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Get userId from JWT
  function getUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) { return null; }
  }

  // Fetch user's videos
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    
    // First try to get videos with auth
    fetch(`https://hubboxbackend.onrender.com/api/video`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('📹 Fetched videos:', data);
        if (Array.isArray(data)) {
          // Sort by latest first and add debug info
          const sortedVideos = data.reverse().map(video => ({
            ...video,
            debugInfo: `ID: ${video.videoId}, File: ${video.url}`
          }));
          setVideos(sortedVideos);
        } else {
          setVideos([]);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching videos:', err);
        setSnackbar({ open: true, message: 'Error fetching videos', severity: 'error' });
      });
  }, [uploading]);

  // Handle video upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setLink('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please login first', severity: 'error' });
      setUploading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('video', file);
    
    try {
      const res = await fetch('https://hubboxbackend.onrender.com/api/video/upload', { 
        method: 'POST', 
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData 
      });
      const data = await res.json();
      if (res.ok) {
        // Create deep link for HubBox app
        const deepLink = `hubbox://video/${data.videoId}`;
        const webLink = `https://hubbox.knowledge4world.com/hubbox/v/${data.videoId}`;
        
        setLink(deepLink);
        setSnackbar({ open: true, message: 'Video uploaded! Share this link to open in HubBox app', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.message || 'Upload failed', severity: 'error' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // Copy link to clipboard
  const copyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
    }
  };

  // Share link
  const shareLink = () => {
    if (link && navigator.share) {
      // Extract videoId from the link
      const videoId = link.split('/').pop();
      const shareableLink = createShareableLink(videoId);
      
      navigator.share({
        title: 'Watch this video in HubBox',
        text: 'Check out this amazing video! Open in HubBox app.',
        url: shareableLink
      });
    } else if (link) {
      copyLink();
    }
  };

  // Open link in app
  const openLinkInApp = () => {
    if (link) {
      // Extract videoId from the link
      const videoId = link.split('/').pop();
      openInApp(videoId);
      setSnackbar({ open: true, message: 'Opening in HubBox app...', severity: 'info' });
    }
  };

  // Auto-open in app when link is generated
  useEffect(() => {
    if (link) {
      // Auto-open in app after 1 second
      const timer = setTimeout(() => {
        const videoId = link.split('/').pop();
        openInApp(videoId);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [link]);

  // Handle deep link clicks
  const handleDeepLinkClick = (videoId) => {
    openInApp(videoId);
    setSnackbar({ open: true, message: 'Opening in HubBox app...', severity: 'info' });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          component="label"
          sx={{ bgcolor: '#00b050', borderRadius: 2, fontWeight: 700 }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
          <input type="file" accept="video/*" hidden onChange={handleUpload} />
        </Button>
        <Button variant="outlined" sx={{ borderColor: '#00b050', color: '#00b050', borderRadius: 2, fontWeight: 700 }}>New Folder</Button>
        <TextField placeholder="Search Files" size="small" sx={{ ml: 'auto', width: 200 }} InputProps={{ endAdornment: <Button sx={{ color: '#00b050', fontWeight: 700 }}>Search</Button> }} />
      </Box>
      {link && (
        <Box sx={{ mt: 2, p: 3, bgcolor: '#f8f9fa', borderRadius: 3, border: '2px solid #e8f5e8', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#00b050" mb={2}>
            🎯 HubBox Deep Link Ready!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Share this link to open video directly in HubBox app:
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: '#fff', 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            mb: 2,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#f8f9fa',
              borderColor: '#00b050'
            }
          }}
          onClick={openLinkInApp}
          >
            <Typography variant="body1" sx={{ 
              wordBreak: 'break-all', 
              fontFamily: 'monospace',
              color: '#00b050',
              fontWeight: 600
            }}>
              {link}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              💡 Click to open in HubBox app
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={openLinkInApp}
              sx={{ 
                bgcolor: '#00b050', 
                fontWeight: 600,
                '&:hover': { bgcolor: '#00913a' }
              }}
            >
              📱 Open in App
            </Button>
            <Button
              variant="outlined"
              onClick={copyLink}
              sx={{ 
                borderColor: '#00b050', 
                color: '#00b050',
                fontWeight: 600,
                '&:hover': { 
                  bgcolor: '#00b050', 
                  color: '#fff' 
                }
              }}
            >
              📋 Copy Link
            </Button>
            <Button
              variant="outlined"
              onClick={shareLink}
              sx={{ 
                borderColor: '#00b050', 
                color: '#00b050',
                fontWeight: 600,
                '&:hover': { 
                  bgcolor: '#00b050', 
                  color: '#fff' 
                }
              }}
            >
              📤 Share Link
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            💡 When someone clicks this link, it will automatically open in HubBox app!
          </Typography>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Video</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center">No videos uploaded yet.</TableCell></TableRow>
            ) : (
              videos.map((video, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <video src={`https://hubboxbackend.onrender.com${video.url}`} width={80} controls style={{ maxHeight: 60 }} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00b050', fontWeight: 600 }}>
                        hubbox://video/{video.videoId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        File: {video.url} | ID: {video.videoId}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ fontSize: '12px', py: 0.5, bgcolor: '#00b050', '&:hover': { bgcolor: '#00913a' }, mt: 1 }}
                        onClick={() => openInApp(video.videoId)}
                      >
                        📱 Open in App
                      </Button>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const message = copyDeepLink(video.videoId);
                            setSnackbar({ open: true, message, severity: 'success' });
                          }}
                          sx={{ fontSize: '12px', py: 0.5 }}
                        >
                          📋 Copy Link
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => window.open(`https://hubboxbackend.onrender.com/api/video/v/${video.videoId}`, '_blank')}
                          sx={{ fontSize: '12px', py: 0.5 }}
                        >
                          🌐 Web View
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{video.views || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

function WithdrawSection() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
          <Typography variant="subtitle1" color="#e53935" fontWeight={700} mb={2}>
            Tips: Please fill in the payment information in English, which will improve the efficiency of payment.
          </Typography>
          <TextField label="Withdrawal amount" fullWidth sx={{ mb: 2 }} />
          <TextField label="Payment method" fullWidth sx={{ mb: 2 }} />
          <TextField label="WhatsApp/Telegram accounts" fullWidth sx={{ mb: 2 }} InputProps={{ endAdornment: <InputAdornment position="end">0 / 50</InputAdornment> }} />
          <Button variant="contained" fullWidth sx={{ bgcolor: '#00b050', color: '#fff', fontWeight: 700, borderRadius: 2, py: 1.2, fontSize: 18, boxShadow: '0 2px 12px #00b05044', '&:hover': { bgcolor: '#00913a' } }}>
            Withdraw
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>Notice:</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>1. The amount of cash withdrawal must be ≥ 10 US dollars. If not, please go ahead and share the link</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>2. We will pay you uniformly on <b>Mondays every week</b> (based on UTC-0 time zone), expected within 48 hours.</Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>3. Exchange rates are quoted in US dollars and accounts are calculated in local currency. The exchange rate is based on the day of payment.</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function UsersList() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch('https://hubboxbackend.onrender.com/api/auth/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!users.length) return <Typography>No users found.</Typography>;

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>All Users</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.name || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function Dashboard({ onLogout }) {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState('Revenue Data');

  // Global click handler for deep links
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.href && target.href.includes('hubbox://')) {
        e.preventDefault();
        const videoId = target.href.split('/').pop();
        openInApp(videoId);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Add global event listener for hubbox:// links
  if (typeof window !== 'undefined') {
    window.__hubbox_deeplink_listener = window.__hubbox_deeplink_listener || false;
    if (!window.__hubbox_deeplink_listener) {
      document.addEventListener('click', function(e) {
        const a = e.target.closest('a');
        if (a && a.href && a.href.startsWith('hubbox://')) {
          e.preventDefault();
          window.location.href = a.href;
          setTimeout(() => {
            const videoId = a.href.split('/').pop();
            window.location.href = `https://hubboxbackend.onrender.com/api/video/v/${videoId}`;
          }, 2000);
        }
      });
      window.__hubbox_deeplink_listener = true;
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1 }}>
        <Avatar sx={{ bgcolor: '#00b050', mr: 1 }}>HB</Avatar>
        <Typography variant="h6" fontWeight={900} color="#00b050">Hub Box</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={selectedSection === item.text}
            onClick={() => {
              setSelectedSection(item.text);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5, '&.Mui-selected': { bgcolor: '#eafff0' } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Paper elevation={0} sx={{ p: 1, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>Storage</Typography>
          <Typography variant="body2" fontWeight={700}>10.00 TB</Typography>
          <Typography variant="caption" color="#00b050">Free space is 10T, additional space requires payment.</Typography>
        </Paper>
      </Box>
    </Box>
  );

  let SectionComponent;
  switch (selectedSection) {
    case 'Revenue Data':
      SectionComponent = <RevenueDataSection />;
      break;
    case 'Link Data':
      SectionComponent = <LinkDataSection />;
      break;
    case 'My file':
      SectionComponent = <MyFileSection />;
      break;
    case 'Withdraw':
      SectionComponent = <WithdrawSection />;
      break;
    default:
      SectionComponent = <RevenueDataSection />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}>
        {/* Topbar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: '#111', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="outlined" sx={{ borderColor: '#00b050', color: '#00b050', fontWeight: 700, borderRadius: 2, px: 3, ml: 2 }}>
              Contact Us
            </Button>
            <Button variant="contained" color="error" sx={{ ml: 2, fontWeight: 700 }} onClick={onLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        {/* Main Dashboard Content */}
        <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
          {SectionComponent}
        </Box>
      </Box>
    </Box>
  );
} 