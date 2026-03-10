import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Typography,
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Delete, Edit, Link as LinkIcon, BarChart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { surveyAPI } from '../services/api';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, surveyId: null });
    const navigate = useNavigate();

    useEffect(() => {
        loadSurveys();
    }, []);

    const loadSurveys = async () => {
        try {
            const response = await surveyAPI.getSurveys();
            setSurveys(response.data);
        } catch (error) {
            console.error('Failed to load surveys:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await surveyAPI.deleteSurvey(deleteDialog.surveyId);
            setSurveys(surveys.filter(s => s._id !== deleteDialog.surveyId));
            setDeleteDialog({ open: false, surveyId: null });
        } catch (error) {
            console.error('Failed to delete survey:', error);
        }
    };

    const copyShareableLink = (survey) => {
        const link = `${window.location.origin}/survey/${survey.shareableLink}/respond`;
        navigator.clipboard.writeText(link);
        alert('Survey link copied to clipboard!');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }} className="animate-fade-in">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className="animate-slide-up">
                <Box>
                    <Typography variant="h3" color="text.primary" gutterBottom>
                        My Surveys
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your surveys and view their responses
                    </Typography>
                </Box>
                <Button 
                    component={Link} 
                    to="/create" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ boxShadow: 2 }}
                >
                    + Create New Survey
                </Button>
            </Box>
            
            {surveys.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed #cbd5e1' }} className="animate-slide-up stagger-1">
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        You haven't created any surveys yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Get started by creating your first survey and gathering feedback.
                    </Typography>
                    <Button component={Link} to="/create" variant="contained" color="primary" size="large">
                        Create Your First Survey
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} className="animate-slide-up stagger-1" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Survey Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }} align="center">Questions</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Created On</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {surveys.map((survey) => (
                                <TableRow 
                                    key={survey._id}
                                    sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}
                                >
                                    <TableCell>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {survey.title}
                                        </Typography>
                                        {survey.description && (
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                                                {survey.description}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={survey.isActive ? 'Active' : 'Inactive'}
                                            color={survey.isActive ? 'success' : 'default'}
                                            variant={survey.isActive ? 'filled' : 'outlined'}
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ fontWeight: 600, bgcolor: '#e2e8f0', display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 4 }}>
                                            {survey.questions?.length || 0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(survey.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                onClick={() => copyShareableLink(survey)}
                                                startIcon={<LinkIcon fontSize="small" />}
                                                sx={{ color: 'text.secondary', borderColor: '#e2e8f0' }}
                                            >
                                                Share
                                            </Button>
                                            <IconButton 
                                                component={Link}
                                                to={`/survey/${survey._id}/analytics`}
                                                color="primary"
                                                title="Analytics"
                                                size="small"
                                                sx={{ bgcolor: '#eff6ff' }}
                                            >
                                                <BarChart fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                component={Link}
                                                to={`/survey/${survey._id}`}
                                                color="info"
                                                title="Edit"
                                                size="small"
                                                sx={{ bgcolor: '#f0fdf4' }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => setDeleteDialog({ open: true, surveyId: survey._id })}
                                                color="error"
                                                title="Delete"
                                                size="small"
                                                sx={{ bgcolor: '#fff1f2' }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog 
                open={deleteDialog.open} 
                onClose={() => setDeleteDialog({ open: false, surveyId: null })}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#0f172a' }}>Delete Survey</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to delete this survey? All associated responses and analytics will be permanently lost.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialog({ open: false, surveyId: null })} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" disableElevation>
                        Yes, Delete It
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SurveyList;