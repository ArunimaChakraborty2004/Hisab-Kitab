const mongoose = require('mongoose');

const savingsPlanSchema = new mongoose.Schema({
  planId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  defaultAmount: { type: Number, required: true },
  defaultMonths: { type: Number, required: true },
  defaultRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SavingsPlan', savingsPlanSchema);
