import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { FiSearch } from 'react-icons/fi';

const categories = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Education', 'Finance', 'Other'];

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchBlogs();
    fetchTrending();
  }, [category]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blogs?category=${category}&search=${search}`);
      setBlogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await api.get('/blogs/trending/top');
      setTrending(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Main Content */}
      <div className="md:w-2/3 lg:w-3/4">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h1>
          
          <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search blogs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow shadow-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {/* Categories Mobile */}
        <div className="flex overflow-x-auto pb-4 mb-6 md:hidden space-x-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-96 border border-gray-100 dark:border-gray-700"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No blogs found.</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 space-y-8">
        {/* Categories Desktop */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Trending Blogs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trending Now</h3>
          <div className="space-y-4">
            {trending.map((blog, idx) => (
              <Link key={blog._id} to={`/blogs/${blog._id}`} className="flex gap-4 items-start group">
                <span className="text-2xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-indigo-200 dark:group-hover:text-indigo-900 transition-colors">
                  0{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {blog.author?.username} • {blog.likes?.length || 0} Likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
