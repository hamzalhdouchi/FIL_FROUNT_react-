import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../../profiel";

const Header = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  const [showUser, setShowUser] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.id : null;
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-wood-800 text-white py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-serif font-bold">
            Serve Quick
          </Link>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none text-lg"
              >
                <div className="w-8 h-8 rounded-full bg-wood-600 flex items-center justify-center">
                  <i className="bx bx-user text-white text-xl" />
                </div>
                <span className="hidden md:inline font-serif">Mon Compte</span>
                <i className={`bx ${isOpen ? "bx-chevron-up" : "bx-chevron-down"}`} />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-base">
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 font-serif text-wood-700 hover:bg-wood-100 w-full text-left"
                  >
                    Mon profil
                  </button>
                  <Link
                    to="/Reservation"
                    className="block px-4 py-2 font-serif text-wood-700 hover:bg-wood-100"
                  >
                    Mes réservations
                  </Link>
                  <div className="border-t border-wood-200 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left font-serif px-4 py-2 text-wood-700 hover:bg-wood-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-2 text-white font-semibold text-lg"
            >
              <i className="bx bx-log-in text-xl" />
              <span>Login</span>
            </Link>
          )}

          {/* Menu Hamburger (mobile) */}
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

      {/* Modal UserProfile */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl relative max-w-4xl w-full p-6 overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-2 text-2xl text-wood-700 hover:text-wood-900"
            >
              &times;
            </button>
            <UserProfile id_user={showUser} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
