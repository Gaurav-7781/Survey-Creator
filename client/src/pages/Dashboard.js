import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    LinearProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { surveyAPI, responseAPI } from '../services/api';

const Dashboard = () => {
    const [surveys, setSurveys] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const surveysResponse = await surveyAPI.getSurveys();
            setSurveys(surveysResponse.data.slice(0, 5));
            
            const analyticsData = {};
            for (const survey of surveysResponse.data.slice(0, 3)) {
                const analyticsResponse = await responseAPI.getSurveyAnalytics(survey._id);
                analyticsData[survey._id] = analyticsResponse.data;
            }
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    const totalSurveys = surveys.length;
    const totalResponses = Object.values(analytics).reduce((sum, a) => sum + (a.totalResponses || 0), 0);

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }} className="animate-fade-in">
            <Box mb={4} className="animate-slide-up">
                <Typography variant="h3" gutterBottom color="text.primary">
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here's a quick summary of your survey performance.
                </Typography>
            </Box>

            <Grid container spacing={4} className="animate-slide-up stagger-1">
                <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: 180,
                        background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }} gutterBottom>
                            Total Surveys Created
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h2" component="div" sx={{ fontWeight: 700 }}>
                                {totalSurveys}
                            </Typography>
                        </Box>
                        <Button 
                            component={Link} 
                            to="/create" 
                            variant="contained" 
                            sx={{ 
                                mt: 'auto', 
                                alignSelf: 'flex-start',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            + New Survey
                        </Button>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: 180,
                        background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }} gutterBottom>
                            Total Responses Collected
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h2" component="div" sx={{ fontWeight: 700 }}>
                                {totalResponses}
                            </Typography>
                        </Box>
                        <Button 
                            component={Link} 
                            to="/surveys" 
                            variant="contained" 
                            sx={{ 
                                mt: 'auto', 
                                alignSelf: 'flex-start',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            View All Data
                        </Button>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} className="animate-slide-up stagger-2" sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                        Recent Surveys
                    </Typography>
                    
                    {surveys.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No surveys created yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Create your first survey to start collecting responses.
                            </Typography>
                            <Button component={Link} to="/create" variant="contained" color="primary">
                                Create First Survey
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {surveys.map((survey, index) => (
                                <Grid item xs={12} md={4} key={survey._id} className={`animate-slide-up stagger-${(index % 3) + 1}`}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography variant="h6" noWrap title={survey.title} sx={{ mb: 1 }}>
                                                {survey.title}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
                                                <Box>
                                                    <Typography variant="h4" color="primary.main" sx={{ lineHeight: 1 }}>
                                                        {analytics[survey._id]?.totalResponses || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Responses
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" color="secondary.main" sx={{ lineHeight: 1 }}>
                                                        {survey.questions?.length || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Questions
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}`}
                                                    size="small" 
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    View
                                                </Button>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}/analytics`}
                                                    size="small" 
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    disableElevation
                                                >
                                                    Analytics
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;