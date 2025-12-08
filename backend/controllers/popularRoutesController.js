const TrackedFlight = require('../models/TrackedFlight');
const { allPopularRoutes } = require('../data/popularRoutes');

// Simple in-memory cache
let cache = {
  data: null,
  timestamp: null
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Randomize price by ±10%
const randomizePrice = (price) => {
  const variation = price * 0.1; // 10%
  const randomFactor = (Math.random() * 2 - 1); // -1 to 1
  return Math.round(price + (variation * randomFactor));
};

const getPopularRoutes = async (req, res) => {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_DURATION) {
      return res.json({
        success: true,
        data: cache.data
      });
    }

    // First try to get routes from TrackedFlight database
    const flights = await TrackedFlight.find({ isActive: true });

    // Group by origin + destination and count frequency
    const routeMap = {};

    flights.forEach(flight => {
      const routeKey = `${flight.origin}-${flight.destination}`;
      
      if (!routeMap[routeKey]) {
        routeMap[routeKey] = {
          origin: flight.origin,
          destination: flight.destination,
          count: 0,
          totalPrice: 0,
          prices: []
        };
      }

      routeMap[routeKey].count++;
      routeMap[routeKey].totalPrice += flight.currentPrice;
      routeMap[routeKey].prices.push(flight.currentPrice);
    });

    // Calculate average price and create route objects
    const dbRoutes = Object.values(routeMap).map(route => ({
      origin: route.origin,
      destination: route.destination,
      count: route.count,
      avgPrice: randomizePrice(Math.round(route.totalPrice / route.count)),
      airline: null // Database routes don't have airline info
    }));

    // Sort by count descending
    const sortedDbRoutes = dbRoutes.sort((a, b) => b.count - a.count);

    let finalRoutes = [...sortedDbRoutes];

    // If less than 6 routes found, fill remaining slots with curated popular routes
    if (finalRoutes.length < 6) {
      const needed = 6 - finalRoutes.length;
      
      // Get curated routes, exclude ones already in dbRoutes
      const existingRouteKeys = new Set(
        finalRoutes.map(r => `${r.origin}-${r.destination}`)
      );

      const availableCuratedRoutes = allPopularRoutes
        .filter(route => {
          const routeKey = `${route.from}-${route.to}`;
          return !existingRouteKeys.has(routeKey);
        })
        .map(route => ({
          origin: route.from,
          destination: route.to,
          count: 0, // Curated routes have no count
          avgPrice: randomizePrice(route.avgPrice),
          airline: route.airline
        }))
        .slice(0, needed);

      finalRoutes = [...finalRoutes, ...availableCuratedRoutes];
    }

    // Limit to top 6 routes
    finalRoutes = finalRoutes.slice(0, 6);

    // Update cache
    cache.data = finalRoutes;
    cache.timestamp = now;

    res.json({
      success: true,
      data: finalRoutes
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    
    // Fallback to curated routes if database query fails
    const fallbackRoutes = allPopularRoutes
      .slice(0, 6)
      .map(route => ({
        origin: route.from,
        destination: route.to,
        count: 0,
        avgPrice: randomizePrice(route.avgPrice),
        airline: route.airline
      }));

    res.json({
      success: true,
      data: fallbackRoutes
    });
  }
};

module.exports = {
  getPopularRoutes
};
