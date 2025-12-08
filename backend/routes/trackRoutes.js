const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected with authMiddleware
router.use(authMiddleware);

// POST / - Add a new tracked flight
router.post('/', trackController.addTrackedFlight);

// GET / - Get all tracked flights for user
router.get('/', trackController.getTrackedFlights);

// DELETE /:id - Delete (soft delete) a tracked flight
router.delete('/:id', trackController.deleteTrackedFlight);

// GET /:id/history - Get price history for a tracked flight
router.get('/:id/history', trackController.getPriceHistory);

module.exports = router;

