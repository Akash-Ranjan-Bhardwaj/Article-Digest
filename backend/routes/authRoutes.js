const express = require('express');
const { signup, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', protect, logout);
router.post('/forgot-password', protect, forgotPassword);
router.post('/reset-password', protect, resetPassword);


module.exports = router;
