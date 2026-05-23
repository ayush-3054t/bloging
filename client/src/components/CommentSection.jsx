import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiTrash2 } from 'react-icons/fi';
import moment from 'moment';

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${blogId}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await api.post(`/comments/${blogId}`, { text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Loading comments...</div>;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img src={user.avatar} alt="You" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
            <div className="flex-grow">
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                rows="3"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">login</a> to leave a comment.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment._id} className="flex space-x-4">
              <img src={comment.author?.avatar} alt={comment.author?.username} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
              <div className="flex-grow bg-white dark:bg-gray-800 p-4 rounded-xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{comment.author?.username}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{moment(comment.createdAt).fromNow()}</span>
                  </div>
                  {user && (user._id === comment.author?._id || user.role === 'admin') && (
                    <button 
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete comment"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
