// AdminPanel.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState(null);
  const [followUpInput, setFollowUpInput] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching admin panel data...');
        const usersRes = await axios.get('http://localhost:5000/api/admin/users');
        const analysesRes = await axios.get('http://localhost:5000/api/admin/analyses');
        
      
  const enrichedAnalyses = analysesRes.data.map(analysis => ({
      ...analysis,
      userEmail: analysis.userId?.email || 'N/A'
      }
 ));



        setUsers(usersRes.data);
        setAnalyses(enrichedAnalyses);
      } catch (error) {
        console.error('Error fetching admin data:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to load admin data');
      }
    };
    fetchData();
  }, []);

  const handleEditUser = async (user) => {
    // Implement edit functionality, e.g., open a modal or redirect
    console.log('Editing user:', user);
    // Example: Prompt for new data and send PUT request
    const updatedData = {
      email: prompt('Enter new email', user.email),
      name: prompt('Enter new name', user.profile?.name || ''),
      age: parseInt(prompt('Enter new age', user.profile?.age || '')),
      gender: prompt('Enter new gender', user.profile?.gender || ''),
      role: user.role
    };
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, updatedData);
      setUsers(users.map(u => (u._id === user._id ? res.data : u)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setAnalyses(analyses.filter(a => a.userId !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAddFollowUp = async (analysisId) => {
    const text = followUpInput[analysisId];
    if (!text) {
      alert('Follow-up text cannot be empty.');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/followups/${analysisId}`,
        { followUpText: text }
      );
      setAnalyses(analyses.map(analysis =>
        analysis._id === analysisId ? res.data : analysis
      ));
      setFollowUpInput(prev => ({ ...prev, [analysisId]: '' }));
    } catch (error) {
      console.error('Error adding follow-up:', error);
      alert(error.response?.data?.message || 'Failed to add follow-up');
    }
  };

  const handleDeleteFollowUp = async (analysisId, index) => {
    if (!window.confirm('Are you sure you want to delete this follow-up?')) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/followups/${analysisId}/${index}`);
      setAnalyses(analyses.map(analysis =>
        analysis._id === analysisId ? res.data : analysis
      ));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete follow-up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-20">
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-serif font-bold text-[#1A2A44] mb-8 text-center animate-fadeIn">
          Admin Panel
        </h1>
        {error && <p className="text-red-600 font-sans text-center mb-6">{error}</p>}
        <div className="space-y-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-3xl font-serif text-[#D4A017] mb-6">Users</h2>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[#1A2A44]">Email</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Name</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Age</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Gender</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4 text-gray-600">{user.profile?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{user.profile?.age || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{user.profile?.gender || 'N/A'}</td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-sans">No users found.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-3xl font-serif text-[#D4A017] mb-6">Prakriti Analyses</h2>
            {analyses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[#1A2A44]">User Email</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Primary Prakriti</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Follow-ups</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.map((analysis) => (
                      <tr
                        key={analysis._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-gray-600">{analysis.userEmail}</td>
                        <td className="py-3 px-4 text-gray-600">{analysis.prakriti.primary}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {analysis.recommendations?.followUp && analysis.recommendations.followUp.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.recommendations.followUp.map((text, index) => (
                                <li key={index} className="flex justify-between items-center">
                                  <span>{text}</span>
                                  <button
                                    onClick={() => handleDeleteFollowUp(analysis._id, index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    &times;
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            'No follow-ups'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Add follow-up"
                              className="border p-1 rounded text-sm w-32"
                              value={followUpInput[analysis._id] || ''}
                              onChange={(e) => setFollowUpInput(prev => ({ ...prev, [analysis._id]: e.target.value }))}
                            />
                            <button
                              onClick={() => handleAddFollowUp(analysis._id)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-sans">No analyses found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;