// Top 20 busiest US domestic routes
const domesticRoutes = [
  { from: 'JFK', to: 'LAX', avgPrice: 320, airline: 'American Airlines' },
  { from: 'JFK', to: 'SFO', avgPrice: 350, airline: 'United Airlines' },
  { from: 'LAX', to: 'JFK', avgPrice: 320, airline: 'Delta Air Lines' },
  { from: 'ORD', to: 'LAX', avgPrice: 280, airline: 'American Airlines' },
  { from: 'ATL', to: 'LAX', avgPrice: 290, airline: 'Delta Air Lines' },
  { from: 'EWR', to: 'LAX', avgPrice: 310, airline: 'United Airlines' },
  { from: 'BOS', to: 'LAX', avgPrice: 330, airline: 'JetBlue Airways' },
  { from: 'DEN', to: 'LAX', avgPrice: 180, airline: 'United Airlines' },
  { from: 'SEA', to: 'LAX', avgPrice: 150, airline: 'Alaska Airlines' },
  { from: 'DFW', to: 'LAX', avgPrice: 220, airline: 'American Airlines' },
  { from: 'MIA', to: 'LAX', avgPrice: 300, airline: 'American Airlines' },
  { from: 'PHX', to: 'LAX', avgPrice: 120, airline: 'American Airlines' },
  { from: 'LAS', to: 'LAX', avgPrice: 100, airline: 'Southwest Airlines' },
  { from: 'SFO', to: 'LAX', avgPrice: 130, airline: 'United Airlines' },
  { from: 'ORD', to: 'MIA', avgPrice: 250, airline: 'American Airlines' },
  { from: 'ATL', to: 'MIA', avgPrice: 180, airline: 'Delta Air Lines' },
  { from: 'JFK', to: 'MIA', avgPrice: 200, airline: 'American Airlines' },
  { from: 'BOS', to: 'MIA', avgPrice: 220, airline: 'JetBlue Airways' },
  { from: 'DEN', to: 'ORD', avgPrice: 150, airline: 'United Airlines' },
  { from: 'SEA', to: 'DEN', avgPrice: 160, airline: 'United Airlines' }
];

// Top 10 busiest international routes from US
const internationalRoutes = [
  { from: 'JFK', to: 'LHR', avgPrice: 750, airline: 'British Airways' },
  { from: 'LAX', to: 'NRT', avgPrice: 950, airline: 'Japan Airlines' },
  { from: 'SFO', to: 'HKG', avgPrice: 1100, airline: 'Cathay Pacific' },
  { from: 'JFK', to: 'CDG', avgPrice: 680, airline: 'Air France' },
  { from: 'LAX', to: 'SYD', avgPrice: 1200, airline: 'Qantas' },
  { from: 'JFK', to: 'FRA', avgPrice: 720, airline: 'Lufthansa' },
  { from: 'MIA', to: 'GRU', avgPrice: 550, airline: 'LATAM Airlines' },
  { from: 'LAX', to: 'ICN', avgPrice: 980, airline: 'Korean Air' },
  { from: 'JFK', to: 'DXB', avgPrice: 850, airline: 'Emirates' },
  { from: 'SFO', to: 'SIN', avgPrice: 1050, airline: 'Singapore Airlines' }
];

// Combine all routes
const allPopularRoutes = [...domesticRoutes, ...internationalRoutes];

module.exports = {
  domesticRoutes,
  internationalRoutes,
  allPopularRoutes
};

