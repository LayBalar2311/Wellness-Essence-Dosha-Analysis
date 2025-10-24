import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserProfile({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  console.log('UserProfile user:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate age
    if (age && (isNaN(age) || parseInt(age) <= 0)) {
      setErrorMessage('Please enter a valid age.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { name, age: age ? parseInt(age) : null, gender };
      console.log('Updating profile with payload:', payload);
      const { data } = await axios.put('http://localhost:5000/api/auth/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Updated user data:', data.user);
      setUser(data.user); // Update user state
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Failed to update profile.');
      } else if (error.request) {
        setErrorMessage('Unable to connect to the server. Please check if the server is running.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      console.error('Update profile error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Your Profile</h1>
        {user ? (
          <div className="space-y-6 animate-fadeIn">
            {errorMessage && <p className="text-red-600 font-sans mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 font-sans mb-4">{successMessage}</p>}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
                />
                <input
                  type="text"
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 p-4 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 p-4 bg-gray-500 text-white font-sans rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {user.email && (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Email</h2>
                    <p className="text-gray-600 font-sans">{user.email}</p>
                  </div>
                )}
                {user.name ? (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Name</h2>
                    <p className="text-gray-600 font-sans">{user.name}</p>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Name</h2>
                    <p className="text-gray-500 font-sans italic">Name not provided</p>
                  </div>
                )}
                {user.age ? (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Age</h2>
                    <p className="text-gray-600 font-sans">{user.age}</p>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Age</h2>
                    <p className="text-gray-500 font-sans italic">Age not provided</p>
                  </div>
                )}
                {user.gender ? (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Gender</h2>
                    <p className="text-gray-600 font-sans">{user.gender}</p>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-sans font-medium text-amber-600">Gender</h2>
                    <p className="text-gray-500 font-sans italic">Gender not provided</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setName(user.name || '');
                    setAge(user.age || '');
                    setGender(user.gender || '');
                    setIsEditing(true);
                  }}
                  className="inline-block px-6 py-3 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 font-sans">Please log in to view your profile.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;