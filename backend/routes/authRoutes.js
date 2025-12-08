const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /register - Register new user
router.post('/register', authController.register);

// POST /login - Login user
router.post('/login', authController.login);

// GET /profile - Get user profile (protected route)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;

