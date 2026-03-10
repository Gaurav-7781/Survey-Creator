const mongoose = require("mongoose");

//
// Sub-schema for options
//
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true
  },
  value: {
    type: String
  }
});


//
// Sub-schema for questions
//
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },

  // FIXED: options should be array of objects, not strings
  options: [optionSchema],
});


//
// Main Survey schema
//
const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  description: {
    type: String,
    trim: true
  },
  
  shareableLink: {
    type: String,
    unique: true,
    sparse: true
  },

  allowMultipleResponses: {
    type: Boolean,
    default: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  startDate: {
    type: Date
  },
  
  endDate: {
    type: Date
  },

  questions: [questionSchema],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


//
// FIX FOR "next is not a function" – remove next entirely
//
surveySchema.pre("save", async function () {
  console.log("🔥 Survey pre-save hook executing");
  // nothing required here, async resolves automatically
});

module.exports = mongoose.model("Survey", surveySchema);
