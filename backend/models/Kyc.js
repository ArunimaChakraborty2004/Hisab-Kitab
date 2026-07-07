const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['aadhar', 'pan', 'voter'],
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  receiptUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Kyc', kycSchema);
