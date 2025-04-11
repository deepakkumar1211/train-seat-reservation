import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Ensure state is synced with localStorage in case of manual token addition
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    // Clear auth state from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);         // Update local state
    navigate("/login");           // Navigate to login page
    window.location.reload();     // Force app state reset
  };

  return (
    <nav className="bg-blue-600 text-white px-4 shadow-md py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">Train Reservation</h1>

        {/* Desktop navigation links */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link to="/" className="hover:underline">Booking</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger menu toggle */}
        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu links */}
      {isMenuOpen && (
        <div className="sm:hidden mt-2 space-y-2 px-2">
          <Link to="/" className="block py-1 hover:underline" onClick={() => setIsMenuOpen(false)}>Booking</Link>
          <Link to="/login" className="block py-1 hover:underline" onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link to="/register" className="block py-1 hover:underline" onClick={() => setIsMenuOpen(false)}>Register</Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
