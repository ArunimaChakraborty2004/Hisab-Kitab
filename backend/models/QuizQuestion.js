const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  isCorrect: { type: Boolean, required: true },
  explanation: {
    en: { type: String },
    hi: { type: String }
  }
});

const quizQuestionSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  options: [optionSchema],
  category: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
