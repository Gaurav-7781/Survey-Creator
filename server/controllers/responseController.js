const Response = require('../models/Response');
const Survey = require('../models/Survey');

exports.submitResponse = async (req, res) => {
    try {
        const { surveyId, answers } = req.body;
        
        const survey = await Survey.findById(surveyId);
        if (!survey || !survey.isActive) {
            return res.status(404).json({ message: 'Survey not found or inactive' });
        }
        
        const existingResponses = await Response.find({ surveyId });
        if (!survey.allowMultipleResponses && existingResponses.length > 0) {
            return res.status(400).json({ message: 'Multiple responses not allowed' });
        }
        
        const respondentInfo = {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        };
        
        const response = new Response({
            surveyId,
            answers,
            respondentInfo
        });
        
        await response.save();
        
        res.status(201).json({
            message: 'Response submitted successfully',
            responseId: response._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSurveyResponses = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.surveyId);
        
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        
        if (survey.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const responses = await Response.find({ surveyId: req.params.surveyId });
        
        res.json({
            survey,
            responses,
            totalResponses: responses.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getResponseAnalytics = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.surveyId);
        
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        
        if (survey.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const responses = await Response.find({ surveyId: req.params.surveyId });
        
        const analytics = {
            totalResponses: responses.length,
            responseRate: 0,
            questionAnalytics: survey.questions.map((question, index) => {
                const questionResponses = responses.map(r => r.answers[index]?.answer);
                
                let summary = {};
                if (question.questionType === 'multiple-choice' || question.questionType === 'checkbox') {
                    const optionCounts = {};
                    questionResponses.forEach(answer => {
                        if (Array.isArray(answer)) {
                            answer.forEach(a => {
                                optionCounts[a] = (optionCounts[a] || 0) + 1;
                            });
                        } else if (answer) {
                            optionCounts[answer] = (optionCounts[answer] || 0) + 1;
                        }
                    });
                    summary = optionCounts;
                } else if (question.questionType === 'rating') {
                    const ratings = questionResponses.filter(r => r !== undefined && r !== null);
                    summary = {
                        average: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0,
                        min: ratings.length ? Math.min(...ratings) : 0,
                        max: ratings.length ? Math.max(...ratings) : 0
                    };
                }
                
                return {
                    questionId: question._id,
                    questionText: question.questionText,
                    type: question.questionType,
                    responseCount: questionResponses.filter(r => r !== undefined && r !== null).length,
                    summary
                };
            })
        };
        
        res.json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};