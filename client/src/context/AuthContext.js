import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Load user on token change
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            console.log('🔍 Loading user...');
            const response = await authAPI.getCurrentUser();
            console.log('✅ User loaded:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('❌ Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            console.log('📝 Registering user:', userData);
            
            const response = await authAPI.register(userData);
            console.log('✅ Registration response:', response.data);
            
            const { token, user } = response.data;
            
            if (token && user) {
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                console.log('✅ Registration successful!');
                return { success: true };
            } else {
                console.error('❌ Invalid response format:', response.data);
                return { 
                    success: false, 
                    error: 'Invalid server response format' 
                };
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            return { 
                success: false, 
                error: error.response?.data?.message || error.message || 'Registration failed' 
            };
        }
    };

    const login = async (credentials) => {
        try {
            console.log('🔐 Attempting login:', credentials);
            
            const response = await authAPI.login(credentials);
            console.log('✅ Login response:', response.data);
            
            const { token, user } = response.data;
            
            if (token && user) {
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                console.log('✅ Login successful!');
                return { success: true };
            } else {
                console.error('❌ Invalid response format:', response.data);
                return { 
                    success: false, 
                    error: 'No authentication token received' 
                };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            return { 
                success: false, 
                error: error.response?.data?.message || error.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        console.log('👋 Logging out...');
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