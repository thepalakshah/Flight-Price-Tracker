const airlineMap = {
  'AA': 'American Airlines',
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'EK': 'Emirates',
  'BA': 'British Airways',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'KL': 'KLM Royal Dutch Airlines',
  'QF': 'Qantas',
  'SQ': 'Singapore Airlines',
  'CX': 'Cathay Pacific',
  'JL': 'Japan Airlines',
  'NH': 'All Nippon Airways',
  'TK': 'Turkish Airlines',
  'QR': 'Qatar Airways',
  'VS': 'Virgin Atlantic',
  'AC': 'Air Canada',
  'AS': 'Alaska Airlines',
  'WN': 'Southwest Airlines',
  'FR': 'Ryanair',
  'U2': 'easyJet',
  'IB': 'Iberia',
  'OS': 'Austrian Airlines',
  'LX': 'Swiss International Air Lines',
  'SN': 'Brussels Airlines',
  'SK': 'Scandinavian Airlines',
  'FI': 'Icelandair',
  'DY': 'Norwegian Air',
  'B6': 'JetBlue Airways',
  'NK': 'Spirit Airlines',
  'F9': 'Frontier Airlines',
  'HA': 'Hawaiian Airlines',
  'VX': 'Virgin America',
  'AI': 'Air India',
  'TG': 'Thai Airways',
  'MH': 'Malaysia Airlines',
  'GA': 'Garuda Indonesia',
  'OZ': 'Asiana Airlines',
  'KE': 'Korean Air',
  'CA': 'Air China',
  'MU': 'China Eastern Airlines',
  'CZ': 'China Southern Airlines'
};

const getAirlineName = (code) => {
  if (!code) {
    return 'Unknown Airlines';
  }
  
  const upperCode = code.toUpperCase();
  return airlineMap[upperCode] || `${code} Airlines`;
};

module.exports = getAirlineName;

