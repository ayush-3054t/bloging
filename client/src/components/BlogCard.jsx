import { Link } from 'react-router-dom';
import moment from 'moment';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Blog Image */}
      <Link to={`/blogs/${blog._id}`} className="block relative h-48 overflow-hidden group">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
        <img 
          src={blog.image !== 'no-photo.jpg' ? blog.image : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={blog.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-indigo-600/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {blog.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{moment(blog.createdAt).format('MMM D, YYYY')}</span>
          <span>•</span>
          <span>{blog.likes?.length || 0} Likes</span>
        </div>

        <Link to={`/blogs/${blog._id}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
          {/* Simple way to strip markdown/html tags for preview */}
          {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
        </p>

        {/* Author info */}
        <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <img src={blog.author?.avatar} alt={blog.author?.username} className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {blog.author?.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
