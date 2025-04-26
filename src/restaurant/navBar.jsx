import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-wood-800 text-white py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold">GourmetTable</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/restaurants" className="hover:text-wood-100 transition">Restaurants</Link>
          <Link to="/about" className="hover:text-wood-100 transition">À propos</Link>
          <Link to="/reservation" className="hover:text-wood-100 transition">Réservation</Link>
          <Link to="/reviews" className="hover:text-wood-100 transition">Avis</Link>
          <Link to="/contact" className="hover:text-wood-100 transition">Contact</Link>
        </div>
        
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          <Link to="/restaurants" className="block hover:text-wood-100 transition">Restaurants</Link>
          <Link to="/about" className="block hover:text-wood-100 transition">À propos</Link>
          <Link to="/reservation" className="block hover:text-wood-100 transition">Réservation</Link>
          <Link to="/reviews" className="block hover:text-wood-100 transition">Avis</Link>
          <Link to="/contact" className="block hover:text-wood-100 transition">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

