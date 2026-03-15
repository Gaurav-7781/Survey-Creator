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
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { 
    Assessment, 
    Poll, 
    Group, 
    TrendingUp, 
    Create as CreateIcon,
    ArrowForward
} from '@mui/icons-material';
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
                try {
                    const analyticsResponse = await responseAPI.getSurveyAnalytics(survey._id);
                    analyticsData[survey._id] = analyticsResponse.data;
                } catch (e) {
                    console.error("error loading analytics for survey", survey._id, e);
                }
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

    // Mock chart data for visualization
    const chartData = surveys.map(s => ({
        name: s.title.substring(0, 10) + '...',
        responses: analytics[s._id]?.totalResponses || 0,
        questions: s.questions?.length || 0
    }));

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }} className="animate-fade-in">
            <Box mb={6} className="animate-slide-up">
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                    Project <span style={{ color: 'var(--mui-palette-primary-main, #4F46E5)' }}>Overview</span>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Welcome back! Monitor your survey performance and activity at a glance.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Section */}
                <Grid item xs={12} md={3} className="animate-slide-up stagger-1">
                    <Paper className="glass-card" sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                        <Assessment sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 80, opacity: 0.1, color: '#4F46E5' }} />
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                            TOTAL SURVEYS
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            {totalSurveys}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981' }}>
                            <TrendingUp fontSize="small" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>+12% from last week</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3} className="animate-slide-up stagger-2">
                    <Paper className="glass-card" sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                        <Group sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 80, opacity: 0.1, color: '#F43F5E' }} />
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                            RESPONSES
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            {totalResponses}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981' }}>
                            <TrendingUp fontSize="small" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>New activity detected</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} className="animate-slide-up stagger-3">
                    <Paper className="glass-card" sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%) !important',
                        color: 'white'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                    Ready to start something new?
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                                    Create a new survey and start gathering insights in minutes.
                                </Typography>
                                <Button 
                                    component={Link}
                                    to="/create"
                                    variant="contained" 
                                    startIcon={<CreateIcon />}
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.95)', 
                                        color: '#4F46E5',
                                        fontWeight: 700,
                                        '&:hover': { 
                                            bgcolor: 'rgba(255,255,255,1)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Create Survey
                                </Button>
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Poll sx={{ fontSize: 100, opacity: 0.4 }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Chart Section */}
                <Grid item xs={12} md={8} className="animate-slide-up stagger-4">
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                            Survey Engagement Overview
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                                <Area type="monotone" dataKey="responses" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorResponses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Quick Links Section */}
                <Grid item xs={12} md={4} className="animate-slide-up stagger-4">
                    <Paper className="glass-card" sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[
                                { label: 'View All Surveys', path: '/surveys' },
                                { label: 'Account Settings', path: '/settings' },
                                { label: 'Help Center', path: '/help' },
                                { label: 'API Documentation', path: '/docs' }
                            ].map((action, i) => (
                                <Button 
                                    key={i}
                                    component={Link}
                                    to={action.path}
                                    variant="outlined"
                                    fullWidth
                                    endIcon={<ArrowForward />}
                                    sx={{ 
                                        justifyContent: 'space-between',
                                        py: 1.5,
                                        borderColor: 'divider',
                                        color: 'text.primary',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(79, 70, 229, 0.05)' }
                                    }}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Surveys */}
                <Grid item xs={12} className="animate-slide-up stagger-5" sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Recent Surveys
                        </Typography>
                        <Button component={Link} to="/surveys" variant="text" sx={{ fontWeight: 600 }}>
                            View all
                        </Button>
                    </Box>
                    
                    {surveys.length === 0 ? (
                        <Paper className="glass-card" sx={{ p: 8, textAlign: 'center' }}>
                            <Poll sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No surveys found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                You haven't created any surveys yet. Start your first survey today!
                            </Typography>
                            <Button component={Link} to="/create" variant="contained">
                                Get Started
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {surveys.map((survey, index) => (
                                <Grid item xs={12} md={4} key={survey._id}>
                                    <Card className="glass-card" sx={{ height: '100%' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h6" noWrap sx={{ fontWeight: 700, mb: 2 }}>
                                                {survey.title}
                                            </Typography>
                                            
                                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                                <Grid item xs={6}>
                                                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                                                        {analytics[survey._id]?.totalResponses || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        RESPONSES
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 800 }}>
                                                        {survey.questions?.length || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        QUESTIONS
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            
                                            <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}`}
                                                    size="small" 
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    component={Link} 
                                                    to={`/survey/${survey._id}/analytics`}
                                                    size="small" 
                                                    variant="contained"
                                                    fullWidth
                                                    disableElevation
                                                >
                                                    Results
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

