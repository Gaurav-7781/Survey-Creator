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
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <MuiLink component={Link} to="/login">
                                Login here
                            </MuiLink>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;