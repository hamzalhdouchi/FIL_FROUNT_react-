import React from "react";

    const Header = ()=> {
    return <>
    <nav className="bg-wood-800 text-white py-4">
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <a href="#" className="text-2xl font-playfair font-bold">Serve Quick</a>
            <div className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-wood-100 transition">Accueil</a>
                <a href="#" className="hover:text-wood-100 transition">Restaurants</a>
                <a href="#" className="hover:text-wood-100 transition">À propos</a>
                <a href="#" className="hover:text-wood-100 transition">Réservation</a>
                <a href="#" className="hover:text-wood-100 transition">Avis</a>
                <a href="#" className="hover:text-wood-100 transition">Contact</a>
            </div>
            <button className="md:hidden text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            </div>
        </nav>
    </>
    };

export default Header;