const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const surveyController = require('../controllers/surveyController');

// Removed router.use(auth) from here to make shareable link public

router.post('/', auth, surveyController.createSurvey);
router.get('/', auth, surveyController.getSurveys);
router.get('/:id', auth, surveyController.getSurvey);
router.put('/:id', auth, surveyController.updateSurvey);
router.delete('/:id', auth, surveyController.deleteSurvey);
router.get('/link/:link', surveyController.getSurveyByLink);


module.exports = router;