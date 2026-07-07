const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// GET /api/schemes - Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({});
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST /api/schemes - Add a new scheme (admin utility)
router.post('/', async (req, res) => {
  try {
    const newScheme = new Scheme(req.body);
    const savedScheme = await newScheme.save();
    res.status(201).json(savedScheme);
  } catch (error) {
    res.status(400).json({ message: "Validation Error", error: error.message });
  }
});

module.exports = router;
