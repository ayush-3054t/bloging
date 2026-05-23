const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get user stats for dashboard
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const totalPosts = await Blog.countDocuments({ author: req.user._id });
    const commentsCount = await Comment.countDocuments({ author: req.user._id });
    const recentPosts = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalPosts,
      commentsCount,
      recentPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserStats,
  updateUserProfile,
};
