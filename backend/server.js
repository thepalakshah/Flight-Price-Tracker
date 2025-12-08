const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { startPriceMonitoring } = require('./services/priceMonitor');
const alertRoutes = require('./routes/alertRoutes');
const testRoutes = require('./routes/testRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Start price monitoring service
startPriceMonitoring();
console.log('Price monitoring service started');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/track', require('./routes/trackRoutes'));
app.use('/api/alerts', alertRoutes);
app.use('/api/popular-routes', require('./routes/popularRoutes'));
app.use('/api/test', testRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Flight Tracker API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

