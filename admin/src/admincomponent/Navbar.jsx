import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#1A2A44] to-[#2A3B5A] text-white p-6 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-serif text-[#D4A017] hover:text-[#E5B83A] transition-colors duration-300">
          Health & Wellness
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-lg font-sans hover:text-[#D4A017] transition-colors duration-300">
            Dashboard
          </Link>
          <Link to="/admin" className="text-lg font-sans hover:text-[#D4A017] transition-colors duration-300">
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;