import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the options for each trait in a single, easy-to-read object.
const optionsMap = {
  skin: ['Dry', 'Oily', 'Balanced'],
  bodyBuild: ['Thin', 'Muscular', 'Heavier'],
  hair: ['Dry, thin', 'Oily, thinning', 'Thick, oily'],
  mindset: ['Restless', 'Intense', 'Calm'],
  memory: ['Forgetful', 'Sharp', 'Slow but long-term'],
  emotions: ['Anxious', 'Angry', 'Content'],
  diet: ['Warm, dry food', 'Cold, spicy', 'Light, sweet'],
  sleep: ['Light', 'Moderate', 'Deep'],
  energy: ['Variable', 'High, bursts', 'Steady'],
  weatherPreference: ['Warm', 'Cool', 'Warm and dry'],
  stressResponse: ['Anxious', 'Irritable', 'Calm'],
};

// FIX: Added setUser to the props list
function PrakritiForm({ user, setUser }) {
  // Initialize state with an object containing empty strings for each trait.
  // We get the keys directly from the optionsMap to ensure consistency.
  const [traits, setTraits] = useState(
    Object.keys(optionsMap).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {})
  );
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTraits({ ...traits, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Simple validation to ensure all fields are selected
    const allFieldsSelected = Object.values(traits).every(value => value !== '');
    if (!allFieldsSelected) {
      setErrorMessage('Please select an option for every trait.');
      return;
    }

    try {
      // 1. Submit the Prakriti analysis
      await axios.post(
        'http://localhost:5000/api/prakriti/analyze',
        { traits },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // 2. Fetch the updated user profile with the new Dosha
      const { data } = await axios.get('http://localhost:5000/api/auth/current-user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // 3. Update the global user state with the latest Dosha
      // This line now works because setUser is available as a prop
      setUser(data.user); 

      // 4. Navigate to the diet page
      navigate('/diet');
      
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Failed to submit analysis.');
      } else if (error.request) {
        setErrorMessage('Unable to connect to the server. Please check if the server is running.');
      } else {
        // This is where the original "unexpected error" message came from
        // due to the ReferenceError/TypeError on setUser.
        setErrorMessage('An unexpected error occurred. Check the console for details.');
      }
      console.error('Submission Error:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Prakriti Assessment</h1>
        {errorMessage && <p className="text-red-600 font-sans mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(optionsMap).map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <select
                id={key}
                name={key}
                value={traits[key]}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans transition-colors duration-300"
              >
                <option value="" disabled>Select an option</option>
                {optionsMap[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="submit"
            className="w-full p-4 bg-amber-600 text-white font-sans rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            Submit Assessment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrakritiForm;