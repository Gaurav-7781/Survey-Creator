import axios from 'axios';

// Use proxy for development
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

// Request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            console.log('🔒 Unauthorized - clearing token');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me')
};

// Survey API
export const surveyAPI = {
    createSurvey: (surveyData) => api.post('/surveys', surveyData),
    getSurveys: () => api.get('/surveys'),
    getSurvey: (id) => api.get(`/surveys/${id}`),
    updateSurvey: (id, surveyData) => api.put(`/surveys/${id}`, surveyData),
    deleteSurvey: (id) => api.delete(`/surveys/${id}`),
    getSurveyByLink: (link) => api.get(`/surveys/link/${link}`)
};

// Response API
export const responseAPI = {
    submitResponse: (responseData) => api.post('/responses/submit', responseData),
    getSurveyResponses: (surveyId) => api.get(`/responses/survey/${surveyId}`),
    getSurveyAnalytics: (surveyId) => api.get(`/responses/analytics/${surveyId}`)
};

export default api;