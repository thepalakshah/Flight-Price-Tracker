const getAirlineName = require('./airlineMap');

// Only initialize Amadeus if credentials exist
let amadeus = null;

try {
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    const Amadeus = require('amadeus');
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET
    });
    console.log('✅ Amadeus API initialized');
  } else {
    console.log('⚠️ Amadeus API credentials not found. Using mock data.');
  }
} catch (error) {
  console.log('⚠️ Amadeus initialization failed. Using mock data.');
  console.error(error.message);
}

// Mock data generator fallback
const generateMockFlights = (origin, destination, date) => {
  const airlines = ['AA', 'DL', 'UA', 'EK', 'BA', 'LH', 'AF', 'KL', 'F9', 'B6'];
  const flights = [];

  for (let i = 0; i < 20; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const basePrice = Math.floor(Math.random() * 600) + 150;
    const departureHour = Math.floor(Math.random() * 16) + 6; // 6 AM to 10 PM
    const flightDuration = Math.floor(Math.random() * 6) + 2; // 2-8 hours

    flights.push({
      flightNumber: `${airline}${Math.floor(Math.random() * 9000) + 1000}`,
      airline: getAirlineName(airline),
      origin: origin,
      destination: destination,
      departureTime: new Date(`${date}T${departureHour.toString().padStart(2, '0')}:00:00`),
      arrivalTime: new Date(`${date}T${(departureHour + flightDuration).toString().padStart(2, '0')}:00:00`),
      status: 'Scheduled',
      price: basePrice,
      currency: 'USD'
    });
  }

  return flights;
};

// Search flights function
const searchFlights = async (origin, destination, date) => {
  // If Amadeus is not configured, use mock data immediately
  if (!amadeus) {
    console.log('Using mock data (Amadeus not configured)');
    return generateMockFlights(origin, destination, date);
  }

  try {
    // Try Amadeus API
    console.log('Searching Amadeus API...');
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: 1,
      max: 20
    });

    console.log(`Found ${response.data.length} flights from Amadeus API`);

    // Map response to flight objects
    const flights = response.data.map(offer => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];
      const airlineCode = segment.carrierCode;
      const price = offer.price.total;
      const currency = offer.price.currency;

      // Convert to USD if not already
      let priceInUSD = parseFloat(price);
      if (currency === 'EUR') {
        priceInUSD = (priceInUSD * 1.1).toFixed(2);
      } else if (currency === 'GBP') {
        priceInUSD = (priceInUSD * 1.27).toFixed(2);
      }

      return {
        flightNumber: `${airlineCode}${segment.number}`,
        airline: getAirlineName(airlineCode),
        origin: segment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        departureTime: new Date(segment.departure.at),
        arrivalTime: new Date(lastSegment.arrival.at),
        status: 'Scheduled',
        price: parseFloat(priceInUSD),
        currency: 'USD'
      };
    });

    return flights;
  } catch (error) {
    console.error('Amadeus API error:', error.message);
    console.log('Using mock data fallback');

    // Return mock data if API fails
    return generateMockFlights(origin, destination, date);
  }
};

module.exports = { searchFlights };