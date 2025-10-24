import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [adminData, setAdminData] = useState({ totalUsers: 0, totalAnalyses: 0 });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
  try {
    console.log('Fetching admin dashboard data...');
    const usersRes = await axios.get('http://localhost:5000/api/admin/users');
    const analysesRes = await axios.get('http://localhost:5000/api/admin/analyses');

    setAdminData({
      totalUsers: usersRes.data.length,
      totalAnalyses: analysesRes.data.length,
    });
    setUsers(usersRes.data);
    console.log('Admin data fetched:', usersRes.data.length, 'users,', analysesRes.data.length, 'analyses');
  } catch (error) {
    console.error('Error fetching admin data:', error.response?.data || error.message);
    setError(error.response?.data?.message || 'Failed to load admin data');
  }
};
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-20">
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-serif font-bold text-[#1A2A44] mb-8 text-center animate-fadeIn">Admin Dashboard</h1>

        <div className="space-y-8 animate-fadeIn">
          {error && <p className="text-red-600 font-sans text-center">{error}</p>}

          {/* Counts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#D4A017] mb-4">Total Users</h3>
              <p className="text-4xl font-sans text-[#1A2A44]">{adminData.totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#D4A017] mb-4">Total Prakriti Analyses</h3>
              <p className="text-4xl font-sans text-[#1A2A44]">{adminData.totalAnalyses}</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-serif text-[#D4A017] mb-6">Users List</h2>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[#1A2A44]">Email</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Name</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Age</th>
                      <th className="py-3 px-4 text-[#1A2A44]">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-gray-600">{u.email}</td>
                        <td className="py-3 px-4 text-gray-600">{u.profile?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{u.profile?.age || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{u.profile?.gender || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-sans">No users found.</p>
            )}
          </div>

          {/* Link to Full Admin Panel */}
          <div className="text-center">
            <Link
              to="/admin"
              className="inline-block px-8 py-4 bg-[#D4A017] text-white font-sans rounded-lg hover:bg-[#E5B83A] transition-colors duration-300"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;