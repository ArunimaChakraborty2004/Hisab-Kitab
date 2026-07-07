// backend/routes/education.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

router.get('/', async (req, res) => {
  try {
    const lang = req.query.lang === 'hi' ? 'hi' : 'en';
    const lessons = await Lesson.find({});
    // map _id to id and select language
    const formatted = lessons.map(l => ({
      id: l._id,
      title: l.title[lang] || l.title.en,
      summary: l.summary[lang] || l.summary.en,
      content: l.content[lang] || l.content.en,
      category: l.category[lang] || l.category.en,
      difficulty: l.difficulty,
      readTime: l.readTime,
      thumbnailColor: l.thumbnailColor
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

module.exports = router;
