const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const responseController = require('../controllers/responseController');

router.post('/submit', responseController.submitResponse);
router.get('/survey/:surveyId', auth, responseController.getSurveyResponses);
router.get('/analytics/:surveyId', auth, responseController.getResponseAnalytics);

module.exports = router;