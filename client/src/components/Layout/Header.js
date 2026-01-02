import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
                    Survey Creator
                </Typography>
                <Box>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">
                                Dashboard
                            </Button>
                            <Button color="inherit" component={Link} to="/surveys">
                                My Surveys
                            </Button>
                            <Button color="inherit" component={Link} to="/create">
                                Create Survey
                            </Button>
                            <Button color="inherit" component={Link} to="/profile">
                                {user?.username || 'User'}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;