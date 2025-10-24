import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Dashboard Component
 * Displays user welcome, latest Prakriti (Dosha), and navigation links.
 * It fetches the latest user data on mount to ensure the Dosha is up-to-date.
 * * @param {object} props - Component props
 * @param {object} props.user - The current user object from global state
 * @param {function} props.setUser - Function to update the global user state
 */
function Dashboard({ user, setUser }) {
  // Use state to manage the loading status and any error message
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch latest user data (including Dosha) on mount for fresh state
  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Check for token before attempting API call
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        // 2. Fetch the latest user data and Dosha from the backend
        const { data } = await axios.get('http://localhost:5000/api/auth/current-user', { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        // Clear any previous error on SUCCESS
        setErrorMessage(''); 
        
        // 3. Update global user state with the fresh data
        setUser(data.user); 
      } catch (error) {
        console.error('Error fetching user data for dashboard:', error);
        
        // Handle invalid/expired token
        if(error.response?.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
        }
        
        // 4. FIX: Only set the error message if we truly have no Dosha data to show
        if (!user?.prakriti) {
            setErrorMessage('Failed to load your latest Dosha. Please try refreshing or logging in again.');
        } else {
            console.warn('Latest Dosha refresh failed, but previous data is still loaded.');
        }
      } finally {
        // 5. Stop loading regardless of success/failure
        setLoading(false);
      }
    };
    fetchUserData();
  }, [setUser, user?.prakriti]); // Dependency array: re-run if setUser changes or if prakriti data suddenly appears/disappears

  const prakriti = user?.prakriti;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-5xl font-serif font-bold text-gray-900 mb-8">Wellness Dashboard</h1>
      {user ? (
        <div>
          <p className="text-xl font-sans text-gray-600 mb-6">Welcome, {user.email}!</p>
          
          {loading && !prakriti && (
             <div className="bg-blue-100 p-4 rounded-lg shadow-inner mb-4">
                <p className="text-blue-700 font-sans">Loading your latest profile and Dosha...</p>
             </div>
          )}
          
          {/* Display error message if set */}
          {errorMessage && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg font-sans mb-4 border border-red-300">
                {errorMessage}
            </p>
          )}

          {/* Dosha Display Section */}
          {!loading && prakriti ? (
            <div className="bg-amber-100 p-4 rounded-2xl shadow-inner mb-8 transition-all duration-300 border-2 border-amber-300">
              <p className="text-2xl font-serif font-bold text-amber-800">
                Your Current Prakriti (Dosha): {prakriti.primary}{' '}
                {prakriti.secondary ? `(${prakriti.secondary})` : ''}
              </p>
              <p className="text-sm font-sans text-amber-700 mt-1">This is based on your most recent assessment.</p>
            </div>
          ) : !loading && !prakriti && (
            <div className="bg-gray-100 p-4 rounded-2xl shadow-inner mb-8 border-2 border-gray-300">
              <p className="text-lg font-sans text-gray-700">
                You haven't completed a **Prakriti analysis** yet. Please start by clicking the card below.
              </p>
            </div>
          )}
          {/* End Dosha Display Section */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Link Cards */}
            <Link
              to="/profile"
              className="p-8 bg-gradient-to-br from-teal-800 to-teal-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-sans">User Profile</span>
            </Link>
            <Link
              to="/prakriti"
              className="p-8 bg-gradient-to-br from-indigo-800 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-sans">Prakriti Analysis</span>
            </Link>
            <Link
              to="/diet"
              className="p-8 bg-gradient-to-br from-green-800 to-green-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-sans">Diet Chart</span>
            </Link>
            <Link
              to="/schedule"
              className="p-8 bg-gradient-to-br from-amber-700 to-amber-500 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-sans">Daily Schedule</span>
            </Link>
            <Link
              to="/follow-up"
              className="p-8 bg-gradient-to-br from-purple-800 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg font-sans">Follow-Ups</span>
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="p-8 bg-gradient-to-br from-red-800 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-lg font-sans">Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 font-sans mb-6">Please log in to access your wellness features.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;