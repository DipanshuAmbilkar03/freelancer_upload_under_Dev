const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bidAmount: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    proposalMessage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);