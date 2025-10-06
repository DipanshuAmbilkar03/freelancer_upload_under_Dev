const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startingPrice: { type: Number, required: true, min: 0 },
    image: { 
    filename: String,
    path: String,
    mimetype: String
},
    subject: { type: String },
    deadline: { type: Date },
    status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);