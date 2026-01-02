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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    My Surveys
                </Typography>
                <Button 
                    component={Link} 
                    to="/create" 
                    variant="contained" 
                    color="primary"
                >
                    Create New Survey
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Questions</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {surveys.map((survey) => (
                            <TableRow key={survey._id}>
                                <TableCell>
                                    <Typography variant="body1">
                                        {survey.title}
                                    </Typography>
                                    {survey.description && (
                                        <Typography variant="body2" color="textSecondary">
                                            {survey.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={survey.isActive ? 'Active' : 'Inactive'}
                                        color={survey.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{survey.questions?.length || 0}</TableCell>
                                <TableCell>
                                    {new Date(survey.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => copyShareableLink(survey)}
                                        title="Copy shareable link"
                                    >
                                        <LinkIcon />
                                    </IconButton>
                                    <IconButton 
                                        component={Link}
                                        to={`/survey/${survey._id}`}
                                        title="Edit"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        component={Link}
                                        to={`/survey/${survey._id}/analytics`}
                                        title="Analytics"
                                    >
                                        <BarChart />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setDeleteDialog({ open: true, surveyId: survey._id })}
                                        title="Delete"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, surveyId: null })}>
                <DialogTitle>Delete Survey</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this survey? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, surveyId: null })}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SurveyList;