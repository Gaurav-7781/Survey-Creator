import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { darkMode, toggleTheme } = useThemeContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ 
            background: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(12px)',
            borderBottom: darkMode ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
            color: 'text.primary',
            zIndex: 1100,
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 70 }}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to="/" 
                        sx={{ 
                            flexGrow: 1, 
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #4F46E5 0%, #F43F5E 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none',
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        SurveyFlow
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                <Button 
                                    component={Link} 
                                    to="/dashboard"
                                    sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}
                                >
                                    Dashboard
                                </Button>
                                <Button 
                                    component={Link} 
                                    to="/surveys"
                                    sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}
                                >
                                    My Surveys
                                </Button>
                                <Button 
                                    component={Link} 
                                    to="/create"
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ mx: 1, boxShadow: 2 }}
                                >
                                    + Create
                                </Button>
                                <Typography variant="body2" sx={{ ml: 2, mr: 1, fontWeight: 600, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
                                    {user?.username || 'User'}
                                </Typography>
                                <Button 
                                    onClick={handleLogout}
                                    size="small"
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.50' } }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    component={Link} 
                                    to="/login"
                                    sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    component={Link} 
                                    to="/register"
                                    sx={{ px: 3, ml: 1, boxShadow: 2 }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                        <IconButton 
                            onClick={toggleTheme} 
                            color="inherit" 
                            sx={{ 
                                ml: 1, 
                                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                            }}
                        >
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;