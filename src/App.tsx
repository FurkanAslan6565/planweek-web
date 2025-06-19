import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Container,
  useMediaQuery,
  Button,
  alpha
} from '@mui/material';
import {
  Home as HomeIcon,
  TrendingUp as StatsIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon
} from '@mui/icons-material';
import { HabitProvider } from './contexts/HabitContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Timer from './components/Timer';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#FF9800',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1E1E1E' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(darkMode ? '#1E1E1E' : '#ffffff', 0.8),
            backdropFilter: 'blur(8px)',
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 70,
            backgroundColor: alpha(darkMode ? '#1E1E1E' : '#ffffff', 0.8),
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid',
            borderColor: 'divider',
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            padding: '8px 0',
            minWidth: 80,
          },
          label: {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
  });

  const settingsPage = (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Ayarlar
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Yakında gelecek özellikler...
      </Typography>
    </Box>
  );

  const NavButton = ({ label, to, index }: { label: string; to: string; index?: number }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Button
        component={Link}
        to={to}
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          minWidth: 'auto',
          px: 2,
          py: 1,
          position: 'relative',
          '&:hover': {
            backgroundColor: 'transparent',
            color: isActive ? 'primary.main' : 'text.primary',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: isActive ? '100%' : '0%',
            height: '2px',
            bgcolor: 'primary.main',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50%)',
          },
          '&:hover::after': {
            width: isActive ? '100%' : '30%',
          },
        }}
      >
        {label}
      </Button>
    );
  };
  
  const AppContent = () => {
    const location = useLocation();
    const paths = ['/', '/stats', '/settings'];
    const currentTab = paths.indexOf(location.pathname);

    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        {/* App Bar */}
        <AppBar position="sticky">
          <Container maxWidth="lg">
            <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 50%, #2196F3 70%)',
                    backgroundSize: '200% auto',
                    animation: 'gradient 3s linear infinite',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    '@keyframes gradient': {
                      '0%': {
                        backgroundPosition: '0% center',
                      },
                      '100%': {
                        backgroundPosition: '-200% center',
                      },
                    },
                  }}
                >
                  HabitTT
                </Typography>
                {!isMobile && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <NavButton label="Ana Sayfa" to="/" />
                    <NavButton label="İstatistikler" to="/stats" />
                    <NavButton label="Ayarlar" to="/settings" />
                  </Box>
                )}
              </Box>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{ 
                  ml: 2,
                  width: 40,
                  height: 40,
                  bgcolor: alpha(darkMode ? '#ffffff' : '#000000', 0.05),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(darkMode ? '#ffffff' : '#000000', 0.1),
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  }
                }}
              >
                {darkMode ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, pb: isMobile ? '70px' : 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={settingsPage} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>

        {/* Bottom Navigation - Only visible on mobile */}
        {isMobile && (
          <Paper 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0,
              zIndex: 1000
            }} 
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={currentTab}
            >
              <BottomNavigationAction component={Link} to="/" label="Ana Sayfa" icon={<HomeIcon />} />
              <BottomNavigationAction component={Link} to="/stats" label="İstatistikler" icon={<StatsIcon />} />
              <BottomNavigationAction component={Link} to="/settings" label="Ayarlar" icon={<SettingsIcon />} />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HabitProvider>
        <Router>
          <AppContent />
        </Router>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
