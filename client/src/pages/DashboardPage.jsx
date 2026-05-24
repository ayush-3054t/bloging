import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { FiEdit2, FiTrash2, FiFileText, FiMessageSquare, FiActivity } from 'react-icons/fi';
import moment from 'moment';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/users/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/blogs/${id}`);
        // Refresh stats after delete
        const { data } = await api.get('/users/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your blogs today.</p>
        </div>
        <Link to="/create-blog" className="hidden sm:inline-flex px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          Write New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalPosts || 0}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <FiMessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.commentsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Views</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">--</h3>
          </div>
        </div>
      </div>

      {/* Recent Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Recent Posts</h2>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {stats?.recentPosts?.length > 0 ? (
            stats.recentPosts.map(post => (
              <div key={post._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <Link to={`/blogs/${post._id}`}>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 mb-1">{post.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex space-x-2">
                    <span>{moment(post.createdAt).format('MMMM D, YYYY')}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{post.category}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/edit-blog/${post._id}`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <FiEdit2 size={18} />
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              You haven't written any posts yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
