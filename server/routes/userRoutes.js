const express = require('express');
const router = express.Router();
const {
  getUserStats,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getUserStats);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
