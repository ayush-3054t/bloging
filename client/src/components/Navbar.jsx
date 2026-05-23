import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle as PlusIcon, FiSun as SunIcon, FiMoon as MoonIcon } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            BlogSpace
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} className="text-yellow-400" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/create-blog" className="flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                  <PlusIcon className="mr-1" />
                  <span className="hidden sm:inline">Write</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 w-48 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100 dark:border-gray-700">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
