import React, { useState } from 'react'; // Trigger recompile
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
    InputLabel,
    Grid
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
        <Container maxWidth="md" sx={{ mt: 6, mb: 8 }} className="animate-fade-in">
            <Box mb={4} className="animate-slide-up">
                <Typography variant="h3" color="text.primary" gutterBottom>
                    Design Your Survey
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Add questions, configure settings, and publish your survey.
                </Typography>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }} className="animate-slide-up stagger-1">
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 5 }}>
                        <TextField
                            fullWidth
                            label="Survey Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{ sx: { fontSize: '1.2rem', fontWeight: 500 } }}
                        />
                        <TextField
                            fullWidth
                            label="Survey Description (Optional)"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </Box>
                    
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                            Questions
                        </Typography>
                        
                        {questions.map((question, qIndex) => (
                            <Paper 
                                key={qIndex} 
                                variant="outlined" 
                                sx={{ 
                                    p: 3, 
                                    mb: 3, 
                                    borderRadius: 2, 
                                    borderColor: '#e2e8f0',
                                    bgcolor: '#f8fafc',
                                    position: 'relative',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': { borderColor: '#cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }
                                }}
                                className={`animate-slide-up stagger-${(qIndex % 3) + 1}`}
                            >
                                <Box display="flex" alignItems="center" mb={3} sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#334155' }}>
                                        Question {qIndex + 1}
                                    </Typography>
                                    <IconButton 
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIndex)} 
                                        disabled={questions.length === 1}
                                        color="error"
                                        size="small"
                                        sx={{ bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Question Type</InputLabel>
                                            <Select
                                                value={question.questionType}
                                                onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                                                label="Question Type"
                                                sx={{ bgcolor: 'white' }}
                                            >
                                                {questionTypes.map(type => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            fullWidth
                                            label="Question Text"
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                            required
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    </Grid>
                                </Grid>
                                
                                {['multiple-choice', 'checkbox', 'dropdown'].includes(question.questionType) && (
                                    <Box sx={{ mt: 4, pl: 2, borderLeft: '3px solid #e2e8f0' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Options
                                        </Typography>
                                        {question.options.map((option, oIndex) => (
                                            <Box key={oIndex} display="flex" alignItems="center" mb={2}>
                                                <TextField
                                                    fullWidth
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                                    size="small"
                                                    sx={{ bgcolor: 'white', maxWidth: 400 }}
                                                />
                                                <IconButton 
                                                    type="button"
                                                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                    disabled={question.options.length === 1}
                                                    size="small"
                                                    sx={{ ml: 1, color: '#94a3b8' }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            type="button"
                                            startIcon={<Add />}
                                            onClick={() => handleAddOption(qIndex)}
                                            size="small"
                                            variant="text"
                                            sx={{ mt: 1 }}
                                        >
                                            Add Another Option
                                        </Button>
                                    </Box>
                                )}
                                
                                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={question.required}
                                                onChange={(e) => handleQuestionChange(qIndex, 'required', e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label={<Typography variant="body2" color="text.secondary">Required</Typography>}
                                        labelPlacement="start"
                                    />
                                </Box>
                            </Paper>
                        ))}
                        
                        <Button
                            type="button"
                            startIcon={<Add />}
                            onClick={handleAddQuestion}
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{ mt: 2, mb: 4, py: 2, borderStyle: 'dashed', borderWidth: 2 }}
                        >
                            Add New Question
                        </Button>
                    </Box>
                    
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            mt: 4, 
                            p: 3, 
                            bgcolor: '#f8fafc', 
                            borderColor: '#e2e8f0',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#1e293b', mb: 2 }}>
                            Survey Settings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.allowMultipleResponses}
                                            onChange={(e) => setSettings({...settings, allowMultipleResponses: e.target.checked})}
                                            color="primary"
                                        />
                                    }
                                    label="Allow Multiple Submissions from same user"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.isActive}
                                            onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                                            color="success"
                                        />
                                    }
                                    label="Survey is Active (can receive responses)"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/surveys')}
                            type="button"
                            size="large"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            size="large"
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Publish Survey
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateSurvey;