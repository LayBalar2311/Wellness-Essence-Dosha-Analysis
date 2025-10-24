import { useState, useEffect } from 'react';
import axios from 'axios';

function DailySchedule({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/prakriti/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAnalysis(data[0]);
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Failed to fetch analysis.');
        } else if (error.request) {
          setErrorMessage('Unable to connect to the server. Please check if the server is running.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
        console.error('Error:', error);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Daily Wellness Schedule</h1>
        {errorMessage && <p className="text-red-600 font-sans mb-4">{errorMessage}</p>}
        {analysis ? (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-serif text-amber-600">
              Prakriti: {analysis.prakriti.primary}{' '}
              {analysis.prakriti.secondary ? `(${analysis.prakriti.secondary})` : ''}
            </h2>
            <h3 className="text-xl font-sans font-medium text-gray-700">Personalized Recommendations:</h3>
           <ul className="list-disc pl-6 space-y-3 text-gray-600 font-sans">
  <li><strong>Morning:</strong> {(analysis.recommendations.schedule?.morning || []).join(', ')}</li>
  <li><strong>Afternoon:</strong> {(analysis.recommendations.schedule?.afternoon || []).join(', ')}</li>
  <li><strong>Evening:</strong> {(analysis.recommendations.schedule?.evening || []).join(', ')}</li>
  <li><strong>Night:</strong> {(analysis.recommendations.schedule?.night || []).join(', ')}</li>
</ul>

          </div>
        ) : (
          !errorMessage && <p className="text-gray-500 font-sans">No analysis found. Please complete your Prakriti analysis.</p>
        )}
      </div>
    </div>
  );
}

export default DailySchedule;