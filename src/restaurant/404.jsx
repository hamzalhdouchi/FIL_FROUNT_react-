import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wood-50 text-wood-800 font-serif">
      <div className="text-center max-w-lg p-6 bg-white shadow-lg rounded-xl border border-wood-200">
        <div className="relative inline-block mb-6">
          <span className="text-[180px] font-extrabold text-wood-200 absolute top-0 left-0 transform translate-x-2 translate-y-2 select-none">404</span>
          <span className="text-[180px] font-extrabold text-wood-700 relative drop-shadow-lg">404</span>
        </div>
        <h1 className="text-3xl font-bold text-wood-800 mb-3">Page Non Trouvée</h1>
        <p className="text-lg text-wood-700 mb-6">Le chef n'a pas pu trouver la page que vous cherchiez.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 border-2 border-wood-600 text-wood-600 rounded-full hover:bg-wood-600 hover:text-white transition font-medium shadow-md"
          >
            Retour à Login
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-wood-700 hover:text-wood-600 hover:underline transition font-medium"
          >
            Retourner
          </button>
        </div>
        <div className="mt-8 text-3xl italic text-wood-700 font-script">Serve Quick</div>
      </div>
      <footer className="mt-12 py-4 text-sm text-wood-600">
        © 2025 Serve Quick - Tous droits réservés
      </footer>
    </div>
  );
};

export default Page404;
