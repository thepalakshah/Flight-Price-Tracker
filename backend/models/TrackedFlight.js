const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const trackedFlightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  airline: {
    type: String
  },
  flightNumber: {
    type: String
  },
  currentPrice: {
    type: Number,
    required: true
  },
  targetPrice: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priceHistory: {
    type: [priceHistorySchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrackedFlight', trackedFlightSchema);

