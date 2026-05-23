const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getTrendingBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBlogs).post(protect, createBlog);
router.get('/trending/top', getTrendingBlogs);
router.route('/:id').get(getBlogById).put(protect, updateBlog).delete(protect, deleteBlog);
router.put('/:id/like', protect, likeBlog);

module.exports = router;
