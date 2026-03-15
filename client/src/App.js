import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import BackgroundDecoration from './components/Layout/BackgroundDecoration';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SurveyList from './pages/SurveyList';
import CreateSurvey from './components/Survey/CreateSurvey';
import SurveyResponse from './components/Survey/SurveyResponse';
import SurveyAnalytics from './components/Survey/SurveyAnalytics';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeContextProvider>
            <CssBaseline />
            <BackgroundDecoration />
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
        </ThemeContextProvider>
    );
}

export default App;