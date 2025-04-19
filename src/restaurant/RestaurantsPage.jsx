import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Pagination from './components/Pagination';
import Footer from './components/footer';
import { Link } from "react-router-dom";
import TableReservationModal from './components/FormReservation';



const RestaurantsPage = () => {
  const [links, setLinks] = useState([]);
  const [restaurants , setRestaurants] = useState([]);

  const fetchData = async (url = 'http://127.0.0.1:8000/api/restaurants') => {
    try {
      const response = await axios.get(url);
      const restaurantAll = response.data.original.data.data;
      console.log(restaurantAll);
      
      setRestaurants(restaurantAll);
      sessionStorage.setItem('restaurant', JSON.stringify(restaurantAll));

      setLinks(response.data.original.data.links); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur lors de la récupération des restaurants.",
        text: error.response?.data?.message,
      });
      console.error('Erreur lors de la récupération des restaurants:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

    const [showReservationModal, setShowReservationModal] = useState(false);
  
    const [reservationForm, setReservationForm] = useState({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
      specialRequests: '',
      preorderCheck: false
    });
  
    const [selectedDishes, setSelectedDishes] = useState([]);
  
    const handleReservationChange = (e) => {
      const { name, value, type, checked } = e.target;
      setReservationForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  
    const handleReservationSubmit = (e) => {
      e.preventDefault();
      const response = await axios.post(`http://127.0.0.1:8000/api/restaurants`);
      console.log('Réservation envoyée :', reservationForm, selectedDishes);
      setShowReservationModal(false); 
    };
  
    const removeDishFromSelection = (indexToRemove) => {
      setSelectedDishes(prev => prev.filter((_, i) => i !== indexToRemove));
    };

  

  console.log(links);
  
  return (
    <div className="font-raleway bg-wood-50 text-wood-900">
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

      <section className="relative h-[40vh] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Nos Restaurants</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Découvrez tous les restaurants disponibles pour votre prochaine expérience culinaire</p>
        </div>
      </section>


      {/* Restaurants Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">Tous les Restaurants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants?.map((restaurante) => (
          <div key={restaurante.id} className="bg-wood-50 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
            <div className="relative">
              <img 
                src={`http://127.0.0.1:8000/api/storage/${restaurante.image}`} 
                alt={restaurante.nom_Restaurant} 
                className="w-full h-56 object-cover" 
              />

              <div className="absolute bottom-4 left-4 bg-wood-700 text-white text-xs font-bold px-2 py-1 rounded">
                {restaurante.adresse}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://via.placeholder.com/50" 
                  alt="Logo" 
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                  <h3 className="text-xl font-bold font-playfair">{restaurante.nom_Restaurant}</h3>
                  <p className="text-sm text-wood-600">{restaurante.directeur}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
              
                <div className="text-sm text-wood-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {restaurante.telephone}
                </div>
              </div>
              
              <p className="text-wood-700 mb-4">Zone de livraison: {restaurante.zone_Livraison}</p>
              

              <div className="flex justify-between items-center">
               <Link
                  to={`/menu/${restaurante.id}`}
                  className={
                    
                       "text-wood-700 hover:text-wood-900 font-semibold"
                  }
                >
                  Voir le menu →
                </Link>
                  <a
                    href="#"
                    className="bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowReservationModal(true);
                    }}
                  >
                    Réserver Table
                  </a>
              </div>
            </div>
          </div>
        ))}

          </div>
          <TableReservationModal
        showModal={showReservationModal}
        closeModal={() => setShowReservationModal(false)}
        reservationForm={reservationForm}
        handleReservationChange={handleReservationChange}
        handleReservationSubmit={handleReservationSubmit}
        selectedDishes={selectedDishes}
        removeDishFromSelection={removeDishFromSelection}
      />
          <div>
            <Pagination links={links} onPageChange={fetchData} />
    </div>
        </div>
      </section>
{/* 
      <TableReservationModal
            showModal={showTableModal}
            closeModal={closeTableReservationModal}
            reservationForm={reservationForm}
            handleReservationChange={handleReservationChange}
            handleReservationSubmit={handleReservationSubmit}
            selectedDishes={selectedDishes}
            removeDishFromSelection={removeDishFromSelection}
        /> */}
      <Footer />
    </div>
  );
};

export default RestaurantsPage;