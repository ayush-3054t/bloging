import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { FiHeart, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data } = await api.get(`/blogs/${id}`);
      setBlog(data);
    } catch (err) {
      setError('Blog not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      setLiking(true);
      const { data } = await api.put(`/blogs/${id}/like`);
      setBlog({ ...blog, likes: data.likes });
    } catch (error) {
      console.error(error);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/blogs/${id}`);
        navigate('/');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
      <Link to="/" className="text-indigo-600 hover:underline flex items-center justify-center">
        <FiArrowLeft className="mr-2" /> Back to Home
      </Link>
    </div>
  );

  const isLiked = user && blog.likes.includes(user._id);
  const isAuthorOrAdmin = user && (user._id === blog.author._id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-6">
        <FiArrowLeft className="mr-2" /> Back to Articles
      </Link>

      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Image */}
        {blog.image !== 'no-photo.jpg' && (
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-[400px] object-cover"
          />
        )}

        <div className="p-8 md:p-12">
          {/* Tags & Actions */}
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-medium rounded-full">
              {blog.category}
            </span>

            {isAuthorOrAdmin && (
              <div className="flex space-x-3">
                <Link to={`/edit-blog/${blog._id}`} className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 dark:bg-gray-700 rounded-full transition-colors">
                  <FiEdit2 />
                </Link>
                <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 dark:bg-gray-700 rounded-full transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-between pb-8 border-b border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center space-x-4">
              <img src={blog.author.avatar} alt={blog.author.username} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{blog.author.username}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {moment(blog.createdAt).format('MMMM D, YYYY')}
                </p>
              </div>
            </div>

            <button 
              onClick={handleLike} 
              disabled={liking}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                isLiked 
                  ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
              <span className="font-medium">{blog.likes.length}</span>
            </button>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Comment Section */}
      <CommentSection blogId={blog._id} />
    </div>
  );
};

export default BlogDetailsPage;
