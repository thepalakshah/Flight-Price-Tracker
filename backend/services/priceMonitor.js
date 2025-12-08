const cron = require('node-cron');
const TrackedFlight = require('../models/TrackedFlight');
const Alert = require('../models/Alert');
const { searchFlights } = require('../utils/flightAPI');

// Check prices for all active tracked flights
const checkPrices = async () => {
  try {
    console.log('Starting price check...');
    
    // Find all active tracked flights
    const trackedFlights = await TrackedFlight.find({ isActive: true });
    
    if (trackedFlights.length === 0) {
      console.log('No active tracked flights found.');
      return;
    }

    console.log(`Checking prices for ${trackedFlights.length} flights...`);

    for (const flight of trackedFlights) {
      try {
        // Format date for API call (YYYY-MM-DD)
        const departureDate = new Date(flight.departureDate);
        const dateString = departureDate.toISOString().split('T')[0];

        // Call searchFlights API
        const flights = await searchFlights(
          flight.origin,
          flight.destination,
          dateString
        );

        if (!flights || flights.length === 0) {
          console.log(`No flights found for ${flight.origin} → ${flight.destination}`);
          continue;
        }

        // Find matching flight by flightNumber or airline, or use first result
        let matchingFlight = flights.find(
          f => f.flightNumber === flight.flightNumber
        );
        
        if (!matchingFlight && flight.airline) {
          matchingFlight = flights.find(
            f => f.airline === flight.airline
          );
        }

        // If no exact match, use the first flight result
        if (!matchingFlight) {
          matchingFlight = flights[0];
        }

        const newPrice = matchingFlight.price;
        const currentPrice = flight.currentPrice;
        const priceDifference = Math.abs(newPrice - currentPrice);

        // Check if price changed by more than $10
        if (priceDifference > 10) {
          // Update flight currentPrice
          flight.currentPrice = newPrice;

          // Add to priceHistory array
          flight.priceHistory.push({
            price: newPrice,
            recordedAt: new Date()
          });

          // Determine alert type
          const alertType = newPrice < currentPrice ? 'price_drop' : 'price_increase';
          const priceChange = newPrice < currentPrice 
            ? `dropped by $${(currentPrice - newPrice).toFixed(2)}`
            : `increased by $${(newPrice - currentPrice).toFixed(2)}`;

          // Create Alert document
          await Alert.create({
            userId: flight.userId,
            trackId: flight._id,
            alertType: alertType,
            message: `Flight ${flight.flightNumber || flight.origin + '-' + flight.destination} price ${priceChange}. New price: $${newPrice.toFixed(2)}`
          });

          console.log(`Price alert created for flight ${flight._id}: ${priceChange}`);
        }

        // Check if price <= targetPrice and targetPrice > 0
        if (newPrice <= flight.targetPrice && flight.targetPrice > 0) {
          // Create target_reached alert
          await Alert.create({
            userId: flight.userId,
            trackId: flight._id,
            alertType: 'target_reached',
            message: `Flight ${flight.flightNumber || flight.origin + '-' + flight.destination} reached your target price of $${flight.targetPrice.toFixed(2)}! Current price: $${newPrice.toFixed(2)}`
          });

          console.log(`Target price reached alert created for flight ${flight._id}`);
        }

        // Save flight changes
        await flight.save();

      } catch (error) {
        console.error(`Error checking price for flight ${flight._id}:`, error);
        // Continue with next flight even if one fails
      }
    }

    console.log('Price check completed.');
  } catch (error) {
    console.error('Error in checkPrices:', error);
  }
};

// Start price monitoring with cron job
const startPriceMonitoring = () => {
  // Run checkPrices every 6 hours: '0 */6 * * *'
  cron.schedule('0 */6 * * *', async () => {
    await checkPrices();
  });

  console.log('Price monitoring started. Will check prices every 6 hours.');
  
  // Run initial check
  checkPrices();
};

module.exports = {
  checkPrices,
  startPriceMonitoring
};

