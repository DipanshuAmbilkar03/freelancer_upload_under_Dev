const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);