import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Education', 'Finance', 'Other'];

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { data } = await api.post('/blogs', {
        title,
        content,
        category,
        image
      });
      navigate(`/blogs/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Editor Side */}
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Post</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://.../img.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content (Markdown supported)</label>
            <textarea
              required
              rows={15}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Heading 1&#10;## Heading 2&#10;**Bold text** and *italic*"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>

      {/* Preview Side */}
      <div className="w-full md:w-1/2 hidden md:block">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 border-b pb-2 dark:border-gray-700">Live Preview</h2>
        
        <div className="prose prose-indigo dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[600px] overflow-y-auto">
          {image && (
            <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-xl mb-8" />
          )}
          <h1>{title || 'Untitled Post'}</h1>
          <ReactMarkdown>{content || '*Content will appear here...*'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
