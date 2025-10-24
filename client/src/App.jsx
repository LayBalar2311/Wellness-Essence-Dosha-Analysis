import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DailySchedule from './components/DailySchedule';
import DietChart from './components/DietChart';
import FollowUp from './components/FollowUp';
import Login from './components/Login';
import PrakritiForm from './components/PrakritiForm';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);

  console.log('App user state:', user);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
       {/* Example in your main App/Router file */}
<Route 
    path="/prakriti" 
    element={<PrakritiForm user={user} setUser={setUser} />} 
/>
        <Route path="/diet" element={<DietChart user={user} />} />
        <Route path="/schedule" element={<DailySchedule user={user} />} />
        <Route path="/follow-up" element={<FollowUp user={user} />} />
        <Route path="/profile" element={<UserProfile user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;