// backend/routes/kyc.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Kyc = require('../models/Kyc');

// ensure directories exist
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const RECEIPT_DIR = path.join(UPLOAD_DIR, 'receipts');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(RECEIPT_DIR)) fs.mkdirSync(RECEIPT_DIR);

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext.replace('.', ''))) cb(null, true);
    else cb(new Error('Only images (jpg/jpeg/png) and PDF are allowed'));
  }
});

// POST /api/kyc/upload -> saves file, generates receipt PDF, returns { url, receiptUrl }
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const documentType = req.body.documentType || 'aadhar';

    const savedFile = req.file.filename;
    const original = req.file.originalname;
    const filesize = req.file.size;
    const savedPath = `/uploads/${savedFile}`; // public path because server serves /uploads
    const uploadedAt = new Date();

    // create receipt PDF
    const receiptName = `kyc-receipt-${Date.now()}.pdf`;
    const receiptPathFS = path.join(RECEIPT_DIR, receiptName);
    const receiptPublicPath = `/uploads/receipts/${receiptName}`;

    // generate a simple PDF using pdfkit
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(receiptPathFS);
      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('KYC Upload Receipt', { align: 'center' });
      doc.moveDown();

      // Body content — adjust as needed (if you have user info, include it)
      doc.fontSize(12).text(`Original filename: ${original}`);
      doc.text(`Saved filename: ${savedFile}`);
      doc.text(`File size: ${(filesize/1024).toFixed(2)} KB`);
      doc.text(`Uploaded at: ${uploadedAt.toISOString()}`);
      doc.moveDown();

      doc.text('Status: KYC document received and stored on server.', { continued: false });
      doc.moveDown(1.2);

      // Optional: show a small thumbnail if image (not for pdf input)
      const lowerExt = path.extname(savedFile).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(lowerExt)) {
        try {
          // insert image with width constraint; wrap in try because image reading may fail
          const imgPath = path.join(UPLOAD_DIR, savedFile);
          doc.image(imgPath, { fit: [200, 200], align: 'left' });
        } catch (imgErr) {
          // ignore image embedding errors
          console.warn('Could not embed image in PDF:', imgErr);
        }
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('This is a system-generated receipt. Keep it for your records.', { align: 'center' });

      doc.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Save to MongoDB
    const kycRecord = new Kyc({
      documentType,
      filename: savedFile,
      originalName: original,
      url: savedPath,
      receiptUrl: receiptPublicPath,
      status: 'pending'
    });
    await kycRecord.save();

    // return info and URL to receipt
    res.json({
      success: true,
      documentType: documentType,
      filename: savedFile,
      url: savedPath,
      receiptUrl: receiptPublicPath,
      message: 'File uploaded and receipt generated'
    });
  } catch (err) {
    console.error('KYC upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
