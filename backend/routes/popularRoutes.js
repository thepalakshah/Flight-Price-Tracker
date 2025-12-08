const express = require('express');
const router = express.Router();
const popularRoutesController = require('../controllers/popularRoutesController');

// GET /api/popular-routes - Get popular routes
router.get('/', popularRoutesController.getPopularRoutes);

module.exports = router;

