import React from "react";

const Footer = () => {
    return <>
        <footer className="bg-wood-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-playfair font-bold mb-4">Serve Quick</h3>
              <p className="mb-4">La meilleure façon de découvrir et réserver dans les restaurants de qualité près de chez vous.</p>
              <p>&copy; 2023 Serve Quick. Tous droits réservés.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-playfair font-bold mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-wood-100 transition">Accueil</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Restaurants</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">À propos</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Réservation</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-playfair font-bold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-wood-100 transition">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Politique de cookies</a></li>
                <li><a href="#" className="hover:text-wood-100 transition">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-playfair font-bold mb-4">Newsletter</h3>
              <p className="mb-4">Inscrivez-vous pour recevoir nos offres spéciales et découvrir les nouveaux restaurants.</p>
              <form className="flex">
                <input type="email" placeholder="Votre email" className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-800" />
                <button type="submit" className="bg-wood-500 hover:bg-wood-400 text-white px-4 rounded-r-md transition duration-300">OK</button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
};

export default Footer