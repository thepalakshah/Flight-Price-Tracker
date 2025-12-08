const express = require('express');
const router = express.Router();
const { checkPrices } = require('../services/priceMonitor');

// Manual price check endpoint (for development/testing only)
router.get('/check-prices', async (req, res) => {
  try {
    console.log('Manual price check triggered via API');
    await checkPrices();
    res.json({
      success: true,
      message: 'Price check completed successfully'
    });
  } catch (error) {
    console.error('Error in manual price check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check prices',
      error: error.message
    });
  }
});

module.exports = router;

