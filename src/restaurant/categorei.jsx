import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';


const BonAppetitCategories = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [categories, setCaegories] = useState([]);
    
  const token = localStorage.getItem('token');

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchCategorie = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categories`);
      console.log(response.data);
       setCaegories(response.data); 
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(()=>{
    fetchCategorie()
  } ,[])

  return (
    <>

      {/* Header/Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                <i className='bx bx-restaurant text-xl text-white'></i>
              </div>
              <div>
                <h1 className="font-bold text-xl brand-text text-wood-800">Bon Appétit</h1>
                <p className="text-xs text-wood-500">Restaurant Français</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="index.html#accueil" className="text-wood-800 hover:text-wood-600 font-medium">Accueil</a>
              <a href="index.html#menu" className="text-wood-800 hover:text-wood-600 font-medium">Menu</a>
              <a href="index.html#about" className="text-wood-800 hover:text-wood-600 font-medium">À Propos</a>
              <a href="index.html#testimonials" className="text-wood-800 hover:text-wood-600 font-medium">Témoignages</a>
              <a href="index.html#contact" className="text-wood-800 hover:text-wood-600 font-medium">Contact</a>
              <a href="index.html#reservation" className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg transition-colors btn-text">Réserver</a>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              id="mobile-menu-button" 
              className="md:hidden text-wood-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className='bx bx-menu text-2xl'></i>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div 
            id="mobile-menu" 
            className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pb-4`}
          >
            <div className="flex flex-col space-y-3">
              <a href="index.html#accueil" className="text-wood-800 hover:text-wood-600 font-medium py-2">Accueil</a>
              <a href="index.html#menu" className="text-wood-800 hover:text-wood-600 font-medium py-2">Menu</a>
              <a href="index.html#about" className="text-wood-800 hover:text-wood-600 font-medium py-2">À Propos</a>
              <a href="index.html#testimonials" className="text-wood-800 hover:text-wood-600 font-medium py-2">Témoignages</a>
              <a href="index.html#contact" className="text-wood-800 hover:text-wood-600 font-medium py-2">Contact</a>
              <a href="index.html#reservation" className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg transition-colors text-center btn-text">Réserver</a>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section 
  className="py-12 bg-wood-800 text-white" 
  style={{ backgroundImage: "url('https://www.bestrestaurantsmaroc.com/public/images/image_rs/_head_format/cc1afa81868c6c2465eb1c51a1540769_527_head.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Nos Catégories</h1>
      <div className="w-20 h-1 bg-wood-400 mx-auto mb-6"></div>
      <p className="text-wood-200 max-w-2xl mx-auto">Découvrez notre sélection de plats français authentiques, préparés avec passion et des ingrédients frais de saison.</p>
    </div>
  </div>
</section>


      {/* Categories Section */}
      <section className="py-16 bg-wood-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <div key={category.id} className="mb-16">
              <div className={`flex flex-col ${category.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center bg-white rounded-xl shadow-lg overflow-hidden`}>
                <div className="md:w-1/3 h-64 md:h-auto">
                  <img src={category.image} alt={category.mon_categorie} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 className="text-3xl font-bold text-wood-800 mb-4 category-title">{category.mon_categorie}</h2>
                  <div className="w-20 h-1 bg-wood-500 mb-6"></div>
                  <p className="text-wood-700 mb-6">{category.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {category.plat.map((plat) => (
                      <div  className="flex items-center">
                        <i className=" bx-Vins text-wood-600 mr-2"></i>
                        <span className="text-wood-800">{plat.nom_plat}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#" className="inline-block bg-wood-600 hover:bg-wood-700 text-white px-6 py-3 rounded-lg transition-colors btn-text">Voir les {category.mon_categorie}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wood-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                  <i className='bx bx-restaurant text-xl'></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl brand-text">Bon Appétit</h3>
                  <p className="text-xs text-wood-400">Restaurant Français</p>
                </div>
              </div>
              <p className="text-wood-300 mb-4">Une expérience culinaire française authentique au cœur de Paris. Venez découvrir notre cuisine raffinée préparée avec passion.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-wood-400 hover:text-white">
                  <i className='bx bxl-facebook text-xl'></i>
                </a>
                <a href="#" className="text-wood-400 hover:text-white">
                  <i className='bx bxl-instagram text-xl'></i>
                </a>
                <a href="#" className="text-wood-400 hover:text-white">
                  <i className='bx bxl-twitter text-xl'></i>
                </a>
                <a href="#" className="text-wood-400 hover:text-white">
                  <i className='bx bxl-tripadvisor text-xl'></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Liens Rapides</h4>
              <ul className="space-y-3">
                <li><a href="index.html#accueil" className="text-wood-300 hover:text-white">Accueil</a></li>
                <li><a href="index.html#menu" className="text-wood-300 hover:text-white">Menu</a></li>
                <li><a href="index.html#about" className="text-wood-300 hover:text-white">À Propos</a></li>
                <li><a href="index.html#reservation" className="text-wood-300 hover:text-white">Réservation</a></li>
                <li><a href="index.html#testimonials" className="text-wood-300 hover:text-white">Témoignages</a></li>
                <li><a href="index.html#contact" className="text-wood-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Horaires d'Ouverture</h4>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-wood-300">Lundi</span>
                  <span className="text-wood-400">Fermé</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-wood-300">Mardi - Vendredi</span>
                  <span className="text-wood-400">12h - 14h30, 19h - 22h30</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-wood-300">Samedi</span>
                  <span className="text-wood-400">12h - 15h, 19h - 23h</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-wood-300">Dimanche</span>
                  <span className="text-wood-400">12h - 15h, 19h - 22h</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-wood-300 mb-4">Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et offres spéciales.</p>
              <form className="space-y-3">
                <div>
                  <input type="email" placeholder="Votre email" className="w-full px-4 py-2 bg-wood-700 border border-wood-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent text-white placeholder-wood-400" />
                </div>
                <button type="submit" className="bg-wood-600 hover:bg-wood-500 text-white px-4 py-2 rounded-lg transition-colors w-full btn-text">S'inscrire</button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-wood-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-wood-400 text-sm mb-4 md:mb-0">© 2025 Bon Appétit. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-wood-400 hover:text-white text-sm">Politique de Confidentialité</a>
              <a href="#" className="text-wood-400 hover:text-white text-sm">Conditions d'Utilisation</a>
              <a href="#" className="text-wood-400 hover:text-white text-sm">Mentions Légales</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        id="back-to-top" 
        className={`fixed bottom-8 right-8 bg-wood-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={scrollToTop}
      >
        <i className='bx bx-up-arrow-alt text-2xl'></i>
      </button>
    </>
  );
};

export default BonAppetitCategories;