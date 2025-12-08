const { searchFlights: searchFlightsAPI } = require('../utils/flightAPI');

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Validate all three parameters are present
    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: origin, destination, and date are required'
      });
    }

    // Call searchFlights utility function
    const flights = await searchFlightsAPI(origin, destination, date);

    // Return JSON response
    res.json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Search flights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching flights'
    });
  }
};

module.exports = { searchFlights };

