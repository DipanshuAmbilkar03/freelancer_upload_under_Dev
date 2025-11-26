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
    filename: String,
    path: String,
    mimetype: String
  }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentPDF', assignmentPdfSchema);
