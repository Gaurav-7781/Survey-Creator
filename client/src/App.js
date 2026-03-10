import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SurveyList from './pages/SurveyList';
import CreateSurvey from './components/Survey/CreateSurvey';
import SurveyResponse from './components/Survey/SurveyResponse';
import SurveyAnalytics from './components/Survey/SurveyAnalytics';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4F46E5', // Indigo 600
            light: '#818CF8',
            dark: '#3730A3',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#F43F5E', // Rose 500
            light: '#FB7185',
            dark: '#E11D48',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F8FAFC', // Slate 50
            paper: '#ffffff',
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        }
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    }
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4338CA 0%, #2563EB 100%)',
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }
                }
            }
        }
    }
});

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/surveys" 
                            element={
                                <PrivateRoute>
                                    <SurveyList />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/create" 
                            element={
                                <PrivateRoute>
                                    <CreateSurvey />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/survey/:id" 
                            element={
                                <PrivateRoute>
                                    <CreateSurvey />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/survey/:id/analytics" 
                            element={
                                <PrivateRoute>
                                    <SurveyAnalytics />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/survey/:link/respond" element={<SurveyResponse />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;