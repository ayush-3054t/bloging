const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Technology',
      'Lifestyle',
      'Travel',
      'Food',
      'Health',
      'Education',
      'Finance',
      'Other'
    ],
    default: 'Other'
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Blog', blogSchema);
