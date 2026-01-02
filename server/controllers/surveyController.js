const Survey = require('../models/Survey');
const Response = require('../models/Response');

exports.createSurvey = async (req, res) => {
    try {
        const { title, description, questions, settings } = req.body;
        
        const survey = new Survey({
            title,
            description,
            questions,
            createdBy: req.user.id,
            ...settings
        });
        
        await survey.save();
        
        res.status(201).json({
            message: 'Survey created successfully',
            survey
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 })
            .select('-questions.options._id');
        
        res.json(surveys);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        
        res.json(survey);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSurvey = async (req, res) => {
    try {
        const { title, description, questions, settings } = req.body;
        
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        
        if (survey.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        survey.title = title || survey.title;
        survey.description = description || survey.description;
        survey.questions = questions || survey.questions;
        
        if (settings) {
            Object.keys(settings).forEach(key => {
                survey[key] = settings[key];
            });
        }
        
        await survey.save();
        
        res.json({
            message: 'Survey updated successfully',
            survey
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }
        
        if (survey.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await Response.deleteMany({ surveyId: survey._id });
        await survey.deleteOne();
        
        res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSurveyByLink = async (req, res) => {
    try {
        const survey = await Survey.findOne({ 
            shareableLink: req.params.link,
            isActive: true 
        });
        
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found or inactive' });
        }
        
        const now = new Date();
        if (survey.startDate && now < survey.startDate) {
            return res.status(400).json({ message: 'Survey not yet started' });
        }
        
        if (survey.endDate && now > survey.endDate) {
            return res.status(400).json({ message: 'Survey has ended' });
        }
        
        res.json(survey);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};