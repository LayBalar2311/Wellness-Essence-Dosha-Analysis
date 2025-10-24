import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate age for registration
    if (isRegister && (!age || isNaN(age) || parseInt(age) <= 0)) {
      setErrorMessage('Please enter a valid age.');
      return;
    }

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { email, password, name, age: parseInt(age), gender } : { email, password };
      console.log('Sending payload:', payload); // Debug payload
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);
      console.log('User data received:', data.user); // Debug response
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setErrorMessage('Unable to connect to the server. Please check if the server is running.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">
          {isRegister ? 'Create Account' : 'Sign In'}
        </h1>
        {errorMessage && <p className="text-red-600 font-sans mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <>
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
            </>
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
          />
          <button
            type="submit"
            className="w-full p-4 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-6 text-amber-600 font-sans hover:text-amber-700 transition-colors duration-300"
        >
          {isRegister ? 'Already have an account? Sign In' : 'Need an account? Create one'}
        </button>
      </div>
    </div>
  );
}

export default Login;