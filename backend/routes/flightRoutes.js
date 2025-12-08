const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /search - Search flights (protected route)
router.get('/search', authMiddleware, flightController.searchFlights);

module.exports = router;

