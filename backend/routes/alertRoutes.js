const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected with authMiddleware
router.use(authMiddleware);

// GET / - Get all alerts for user
router.get('/', alertController.getAlerts);

// PUT /:id/read - Mark alert as read
router.put('/:id/read', alertController.markAsRead);

// DELETE /:id - Delete alert
router.delete('/:id', alertController.deleteAlert);

// DELETE /read - Delete all read alerts
router.delete('/read', alertController.deleteReadAlerts);

module.exports = router;

