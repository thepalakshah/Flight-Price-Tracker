const TrackedFlight = require('../models/TrackedFlight');

// Add a tracked flight
const addTrackedFlight = async (req, res) => {
  try {
    const { origin, destination, departureDate, airline, flightNumber, currentPrice, targetPrice } = req.body;
    const userId = req.userId;

    const trackedFlight = new TrackedFlight({
      userId,
      origin,
      destination,
      departureDate,
      airline,
      flightNumber,
      currentPrice,
      targetPrice: targetPrice || 0,
      priceHistory: [{
        price: currentPrice,
        recordedAt: new Date()
      }]
    });

    await trackedFlight.save();

    res.status(201).json({
      success: true,
      data: trackedFlight
    });
  } catch (error) {
    console.error('Add tracked flight error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add tracked flight'
    });
  }
};

// Get all tracked flights for user
const getTrackedFlights = async (req, res) => {
  try {
    const userId = req.userId;

    const flights = await TrackedFlight.find({
      userId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Get tracked flights error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get tracked flights'
    });
  }
};

// Delete tracked flight
const deleteTrackedFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log('Delete request - Flight ID:', id, 'User ID:', userId);

    // Find and update the flight (soft delete)
    const flight = await TrackedFlight.findOneAndUpdate(
      { _id: id, userId: userId },
      { isActive: false },
      { new: true }
    );

    if (!flight) {
      console.log('Flight not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: 'Flight not found or unauthorized'
      });
    }

    console.log('Flight deleted successfully:', flight._id);

    res.json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete flight'
    });
  }
};

// Get price history for a flight
const getPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const flight = await TrackedFlight.findOne({ _id: id, userId });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: {
        flight: {
          origin: flight.origin,
          destination: flight.destination,
          airline: flight.airline,
          flightNumber: flight.flightNumber
        },
        priceHistory: flight.priceHistory
      }
    });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get price history'
    });
  }
};

module.exports = {
  addTrackedFlight,
  getTrackedFlights,
  deleteTrackedFlight,
  getPriceHistory
};