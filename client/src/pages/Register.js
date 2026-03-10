import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return setError('Passwords do not match');
        }
        
        console.log('Passwords match, proceeding with registration');
        setError('');
        setLoading(true);

        const result = await register({ username, email, password });
        console.log('Registration result:', result);
        
        if (result.success) {
            console.log('Registration successful, navigating to dashboard');
            navigate('/dashboard');
        } else {
            console.log('Registration failed with error:', result.error);
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 10, mb: 8 }} className="animate-fade-in">
            <Paper 
                elevation={0}
                sx={{ 
                    p: 5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 4,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
                    Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    Join SurveyFlow to start creating and sharing beautifully designed surveys.
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ 
                            mt: 2, 
                            mb: 3, 
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <MuiLink 
                                component={Link} 
                                to="/login" 
                                sx={{ 
                                    fontWeight: 600, 
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Log in
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;