import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    IconButton,
    FormControlLabel,
    Switch,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { surveyAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const questionTypes = [
    { value: 'text', label: 'Text Answer' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'rating', label: 'Rating Scale' },
    { value: 'date', label: 'Date' }
];

const CreateSurvey = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{
        questionType: 'text',
        questionText: '',
        options: [{ text: '', value: '' }],
        required: false,
        placeholder: ''
    }]);
    const [settings, setSettings] = useState({
        allowMultipleResponses: true,
        isActive: true
    });

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            questionType: 'text',
            questionText: '',
            options: [{ text: '', value: '' }],
            required: false,
            placeholder: ''
        }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        
        if (field === 'questionType' && !['multiple-choice', 'checkbox', 'dropdown'].includes(value)) {
            newQuestions[index].options = [{ text: '', value: '' }];
        }
        
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex][field] = value;
        newQuestions[qIndex].options[oIndex].value = value.toLowerCase().replace(/\s+/g, '_');
        setQuestions(newQuestions);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', value: '' });
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length > 1) {
            newQuestions[qIndex].options.splice(oIndex, 1);
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Creating survey...');
        
        // Basic validation
        if (!title.trim()) {
            alert('Please enter a survey title');
            return;
        }
        
        // Log data for debugging
        console.log('Survey Data:', {
            title,
            description,
            questions,
            settings
        });
        
        try {
            const surveyData = { 
                title, 
                description, 
                questions, 
                settings 
            };
            
            // Check if surveyAPI exists
            if (!surveyAPI || !surveyAPI.createSurvey) {
                console.error('surveyAPI.createSurvey not found');
                alert('API service not configured. Check console.');
                return;
            }
            
            console.log('Calling API...');
            const response = await surveyAPI.createSurvey(surveyData);
            console.log('API Response:', response.data);
            
            alert('Survey created successfully!');
            navigate('/surveys');
            
        } catch (error) {
            console.error('Failed to create survey:', error);
            alert('Failed to create survey. Error: ' + (error.message || 'Unknown error'));
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Create New Survey
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Survey Title *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Questions
                        </Typography>
                        {questions.map((question, qIndex) => (
                            <Paper key={qIndex} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                        Question {qIndex + 1}
                                    </Typography>
                                    <IconButton 
                                        onClick={() => handleRemoveQuestion(qIndex)} 
                                        disabled={questions.length === 1}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                                
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Question Type</InputLabel>
                                    <Select
                                        value={question.questionType}
                                        onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                                        label="Question Type"
                                    >
                                        {questionTypes.map(type => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                                <TextField
                                    fullWidth
                                    label="Question Text *"
                                    value={question.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                    margin="normal"
                                    required
                                />
                                
                                {['multiple-choice', 'checkbox', 'dropdown'].includes(question.questionType) && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Options
                                        </Typography>
                                        {question.options.map((option, oIndex) => (
                                            <Box key={oIndex} display="flex" alignItems="center" mb={1}>
                                                <TextField
                                                    fullWidth
                                                    label={`Option ${oIndex + 1}`}
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                                    size="small"
                                                />
                                                <IconButton 
                                                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                    disabled={question.options.length === 1}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            startIcon={<Add />}
                                            onClick={() => handleAddOption(qIndex)}
                                            size="small"
                                        >
                                            Add Option
                                        </Button>
                                    </Box>
                                )}
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={question.required}
                                            onChange={(e) => handleQuestionChange(qIndex, 'required', e.target.checked)}
                                        />
                                    }
                                    label="Required"
                                    sx={{ mt: 2 }}
                                />
                            </Paper>
                        ))}
                        
                        <Button
                            startIcon={<Add />}
                            onClick={handleAddQuestion}
                            variant="outlined"
                            sx={{ mb: 3 }}
                        >
                            Add Question
                        </Button>
                    </Box>
                    
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Survey Settings
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.allowMultipleResponses}
                                    onChange={(e) => setSettings({...settings, allowMultipleResponses: e.target.checked})}
                                />
                            }
                            label="Allow Multiple Responses"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.isActive}
                                    onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/surveys')}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                        >
                            Create Survey
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateSurvey;