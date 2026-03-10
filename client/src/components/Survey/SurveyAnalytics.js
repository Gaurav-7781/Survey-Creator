import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    LinearProgress,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { responseAPI } from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SurveyAnalytics = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [id]);

    const loadAnalytics = async () => {
        try {
            const response = await responseAPI.getSurveyAnalytics(id);
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    if (!analytics) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>No analytics data available</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Survey Analytics
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Responses
                            </Typography>
                            <Typography variant="h3">
                                {analytics.totalResponses}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Response Rate
                            </Typography>
                            <Typography variant="h3">
                                {analytics.responseRate}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {analytics.questionAnalytics.map((questionAnalytic, index) => (
                <Paper key={index} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {index + 1}. {questionAnalytic.questionText}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        Type: {questionAnalytic.type} | Responses: {questionAnalytic.responseCount}
                    </Typography>
                    
                    {['multiple-choice', 'checkbox'].includes(questionAnalytic.type) && (
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Distribution
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={Object.entries(questionAnalytic.summary).map(([key, value]) => ({ name: key, value }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Pie Chart
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(questionAnalytic.summary).map(([key, value]) => ({ name: key, value }))}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {Object.entries(questionAnalytic.summary).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Grid>
                            </Grid>
                            
                            <TableContainer component={Paper} sx={{ mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Option</TableCell>
                                            <TableCell align="right">Count</TableCell>
                                            <TableCell align="right">Percentage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(questionAnalytic.summary).map(([option, count]) => (
                                            <TableRow key={option}>
                                                <TableCell>{option}</TableCell>
                                                <TableCell align="right">{count}</TableCell>
                                                <TableCell align="right">
                                                    {((count / questionAnalytic.responseCount) * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    
                    {questionAnalytic.type === 'rating' && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Statistics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary">Average</Typography>
                                            <Typography variant="h5">
                                                {questionAnalytic.summary.average}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary">Minimum</Typography>
                                            <Typography variant="h5">
                                                {questionAnalytic.summary.min}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography color="textSecondary">Maximum</Typography>
                                            <Typography variant="h5">
                                                {questionAnalytic.summary.max}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            ))}
        </Container>
    );
};

export default SurveyAnalytics;