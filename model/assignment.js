const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startingPrice: { type: Number, required: true, min: 0 },
  image: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80'
  },
  subject: { type: String },
  deadline: { type: Date },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  pdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentPDF' }],
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
