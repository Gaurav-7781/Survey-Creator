import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Alert,
    LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyAPI, responseAPI } from '../../services/api';

const SurveyResponse = () => {
    const { link } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadSurvey();
    }, [link]);

    const loadSurvey = async () => {
        try {
            const response = await surveyAPI.getSurveyByLink(link);
            setSurvey(response.data);
            
            const initialAnswers = {};
            response.data.questions.forEach((q, index) => {
                if (q.questionType === 'checkbox') {
                    initialAnswers[index] = [];
                }
            });
            setAnswers(initialAnswers);
        } catch (error) {
            setError('Survey not found or inactive');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleCheckboxChange = (questionIndex, optionValue, checked) => {
        setAnswers(prev => {
            const currentAnswers = prev[questionIndex] || [];
            let newAnswers;
            
            if (checked) {
                newAnswers = [...currentAnswers, optionValue];
            } else {
                newAnswers = currentAnswers.filter(v => v !== optionValue);
            }
            
            return {
                ...prev,
                [questionIndex]: newAnswers
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formattedAnswers = Object.keys(answers).map(index => ({
            questionId: survey.questions[index]._id,
            answer: answers[index]
        }));
        
        setSubmitting(true);
        setError('');
        
        try {
            await responseAPI.submitResponse({
                surveyId: survey._id,
                answers: formattedAnswers
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit response');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    if (error && !survey) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (success) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="success">
                    Thank you for completing the survey! You will be redirected to the homepage.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {survey.title}
                </Typography>
                {survey.description && (
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {survey.description}
                    </Typography>
                )}
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    {survey.questions.map((question, index) => (
                        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {index + 1}. {question.questionText}
                                {question.required && (
                                    <Typography component="span" color="error">
                                        *
                                    </Typography>
                                )}
                            </Typography>
                            
                            {question.questionType === 'text' && (
                                <TextField
                                    fullWidth
                                    placeholder={question.placeholder || 'Enter your answer'}
                                    value={answers[index] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    required={question.required}
                                    multiline={question.multiline}
                                    rows={question.rows || 1}
                                />
                            )}
                            
                            {question.questionType === 'multiple-choice' && (
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={answers[index] || ''}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    >
                                        {question.options.map((option, optionIndex) => (
                                            <FormControlLabel
                                                key={optionIndex}
                                                value={option.value}
                                                control={<Radio required={question.required} />}
                                                label={option.text}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                            
                            {question.questionType === 'checkbox' && (
                                <FormControl component="fieldset">
                                    {question.options.map((option, optionIndex) => (
                                        <FormControlLabel
                                            key={optionIndex}
                                            control={
                                                <Checkbox
                                                    checked={(answers[index] || []).includes(option.value)}
                                                    onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                                                />
                                            }
                                            label={option.text}
                                        />
                                    ))}
                                </FormControl>
                            )}
                            
                            {question.questionType === 'rating' && (
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        value={answers[index] || ''}
                                        onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
                                    >
                                        {Array.from(
                                            { length: Math.floor((question.max - question.min) / (question.step || 1)) + 1 },
                                            (_, i) => question.min + i * (question.step || 1)
                                        ).map((value) => (
                                            <FormControlLabel
                                                key={value}
                                                value={value.toString()}
                                                control={<Radio required={question.required} />}
                                                label={value.toString()}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </Box>
                    ))}
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Response'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default SurveyResponse;