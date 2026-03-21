const mongoose = require('mongoose');

const assignmentPdfSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  file: {
    filename: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    mimetype: { type: String, required: true, trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentPDF', assignmentPdfSchema);
