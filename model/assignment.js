const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  startingPrice: {
    type: Number,
    required: true,
    min: 0,
    set: (v) => Number(v)
  },
  image: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80'
  },
  subject: { type: String, default: '', trim: true },
  deadline: { type: Date },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: '', trim: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  pdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentPDF' }],
}, { timestamps: true });

assignmentSchema.index({ postedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
