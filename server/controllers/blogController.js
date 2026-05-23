const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let blogsQuery = Blog.find(query).populate('author', 'username avatar');

    if (sort === 'oldest') {
      blogsQuery = blogsQuery.sort({ createdAt: 1 });
    } else {
      blogsQuery = blogsQuery.sort({ createdAt: -1 }); // default newest
    }

    const blogs = await blogsQuery;
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username avatar');

    if (blog) {
      res.json(blog);
    } else {
      res.status(404);
      throw new Error('Blog not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;

    const blog = new Blog({
      title,
      content,
      category,
      image: image || 'no-photo.jpg',
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      // Check if user is author or admin
      if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this blog');
      }

      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.category = category || blog.category;
      blog.image = image || blog.image;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404);
      throw new Error('Blog not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this blog');
      }

      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404);
      throw new Error('Blog not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      const isLiked = blog.likes.includes(req.user._id);

      if (isLiked) {
        blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
      } else {
        blog.likes.push(req.user._id);
      }

      await blog.save();
      res.json({ likes: blog.likes });
    } else {
      res.status(404);
      throw new Error('Blog not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending/top
// @access  Public
const getTrendingBlogs = async (req, res, next) => {
  try {
    // Sort by number of likes
    const blogs = await Blog.aggregate([
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate author
    const populatedBlogs = await Blog.populate(blogs, { path: 'author', select: 'username avatar' });
    
    res.json(populatedBlogs);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getTrendingBlogs,
};
