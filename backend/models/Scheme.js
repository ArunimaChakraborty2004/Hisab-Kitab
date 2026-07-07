const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  link: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
