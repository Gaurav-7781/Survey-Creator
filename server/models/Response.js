const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answer: mongoose.Schema.Types.Mixed
});

const responseSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    answers: [answerSchema],
    submittedAt: {
        type: Date,
        default: Date.now
    },
    respondentInfo: {
        ipAddress: String,
        userAgent: String
    }
});

module.exports = mongoose.model('Response', responseSchema);