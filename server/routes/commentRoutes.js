const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addComment,
  getComments,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:blogId').post(protect, addComment).get(getComments);
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
