import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Load user on token change - only if user not already loaded
    useEffect(() => {
        if (token && !user) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data;
            
            if (token && user) {
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid server response format' };
            }
        } catch (error) {
            let errorMessage = error.response?.data?.message;
            if (!errorMessage && error.response?.data?.errors?.length > 0) {
                errorMessage = error.response.data.errors[0].msg;
            }
            return { 
                success: false, 
                error: errorMessage || error.message || 'Registration failed' 
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;
            
            if (token && user) {
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                return { success: true };
            } else {
                return { success: false, error: 'No authentication token received' };
            }
        } catch (error) {
            let errorMessage = error.response?.data?.message;
            if (!errorMessage && error.response?.data?.errors?.length > 0) {
                errorMessage = error.response.data.errors[0].msg;
            }
            return { 
                success: false, 
                error: errorMessage || error.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        loading,
        token,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};