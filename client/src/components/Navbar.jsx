import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white p-6 sticky top-0 z-20 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-serif font-bold text-amber-400 tracking-wide transition-transform duration-300 hover:scale-105">
          Wellness Essence
        </Link>
        <div className="space-x-8">
          <Link to="/" className="text-lg font-sans text-amber-200 hover:text-amber-300 transition-colors duration-300">
            Dashboard
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-lg font-sans text-amber-200 hover:text-amber-300 transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-lg font-sans text-amber-200 hover:text-amber-300 transition-colors duration-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;