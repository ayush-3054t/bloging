const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Add a comment
// @route   POST /api/comments/:blogId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    const comment = new Comment({
      text,
      blogId,
      author: req.user._id,
    });

    const createdComment = await comment.save();
    
    // Populate author info before returning
    await createdComment.populate('author', 'username avatar');
    
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
      if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this comment');
      }

      await comment.deleteOne();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404);
      throw new Error('Comment not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
