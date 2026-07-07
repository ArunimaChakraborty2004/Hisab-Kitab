const express = require('express');
const router = express.Router();
const SavingsPlan = require('../models/SavingsPlan');

// GET /api/savings-plans - Get all savings plans
router.get('/', async (req, res) => {
  try {
    const plans = await SavingsPlan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST /api/savings-plans - Add a new savings plan example (admin utility)
router.post('/', async (req, res) => {
  try {
    const newPlan = new SavingsPlan(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: "Validation Error", error: error.message });
  }
});

module.exports = router;
