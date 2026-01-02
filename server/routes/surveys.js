const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const surveyController = require('../controllers/surveyController');

router.use(auth);

router.post('/', surveyController.createSurvey);
router.get('/', surveyController.getSurveys);
router.get('/:id', surveyController.getSurvey);
router.put('/:id', surveyController.updateSurvey);
router.delete('/:id', surveyController.deleteSurvey);
router.get('/link/:link', surveyController.getSurveyByLink);

module.exports = router;