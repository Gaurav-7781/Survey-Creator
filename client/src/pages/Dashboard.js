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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Surveys
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            {totalSurveys}
                        </Typography>
                        <Button component={Link} to="/surveys" variant="outlined" size="small">
                            View All
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography variant="h6" gutterBottom>
                            Total Responses
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            {totalResponses}
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Surveys
                        </Typography>
                        <Grid container spacing={2}>
                            {surveys.map(survey => (
                                <Grid item xs={12} md={6} key={survey._id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{survey.title}</Typography>
                                            <Typography color="textSecondary" gutterBottom>
                                                {survey.questions?.length || 0} questions
                                            </Typography>
                                            <Typography variant="body2">
                                                {analytics[survey._id]?.totalResponses || 0} responses
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}`}
                                                    size="small" 
                                                    variant="outlined"
                                                >
                                                    View
                                                </Button>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}/analytics`}
                                                    size="small" 
                                                    variant="outlined"
                                                >
                                                    Analytics
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;