import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-wood-800 text-white py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-playfair font-bold">
          Serve Quick
        </Link>

        {token ? (
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none text-lg">
              <div className="w-8 h-8 rounded-full bg-wood-600 flex items-center justify-center">
                <i className="bx bx-user text-white text-xl" />
              </div>
              <span className="hidden md:inline">Mon Compte</span>
              <i className="bx bx-chevron-down" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-base">
              <Link
                to="/profile"
                className="block px-4 py-2 text-wood-700 hover:bg-wood-100"
              >
                Mon profil
              </Link>
              <Link
                to="/Reservation"
                className="block px-4 py-2 text-wood-700 hover:bg-wood-100"
              >
                Mes réservations
              </Link>
              <div className="border-t border-wood-200 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-wood-700 hover:bg-wood-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        ) : (
          <Link to="/" className="flex items-center space-x-2 text-white font-semibold text-lg">
            <i className="bx bx-log-in text-xl" />
            <span>Login</span>
          </Link>
        )}

        <button className="md:hidden text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Header;
