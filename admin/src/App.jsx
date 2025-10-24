import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './admincomponent/Navbar';
import Dashboard from './admincomponent/Dashbord'; // Note: File is named Dashbord.jsx
import AdminPanel from './admincomponent/AdminPanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;