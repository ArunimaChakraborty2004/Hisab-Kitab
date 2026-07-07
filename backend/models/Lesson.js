const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  summary: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  content: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  category: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  difficulty: { type: String, required: true },
  readTime: { type: String, required: true },
  thumbnailColor: { type: String, default: '#3b82f6' }
});

module.exports = mongoose.model('Lesson', lessonSchema);
