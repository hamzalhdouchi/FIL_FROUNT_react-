import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import Pagination from './components/Pagination';
import Footer from './components/footer';
import { Link, Navigate } from "react-router-dom";
import TableReservationModal from './components/FormReservation';
import Header from './components/layout/header';

const RestaurantsPage = () => {
  
  const [links, setLinks] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [restaurant_id, setSelectedRestaurantId] = useState(0);
  const [user_id, setUserId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    special_requests: '',
    preorderCheck: false
  });

  const [selectedDishes, setSelectedDishes] = useState([]);

  
  const fetchData = async (url = 'http://127.0.0.1:8000/api/restaurants/accepted') => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const restaurantAll = response.data.original.data.data;

      setRestaurants(restaurantAll);
      setAllRestaurants(restaurantAll);
      sessionStorage.setItem('restaurant', JSON.stringify(restaurantAll));
      setLinks(response.data.original.data.links);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur lors de la récupération des restaurants.",
        text: error.response?.data?.message || 'Une erreur est survenue.',
      });
      console.error('Erreur lors de la récupération des restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id);
      console.log(storedUser.id);
      
    }
    fetchData();
  }, []);
  
  const handleReservationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReservationForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    const reservationDateTime = new Date(`${reservationForm.date}T${reservationForm.time}`);
    const now = new Date();
    
    if (reservationDateTime > now) {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/reservations`, {
          ...reservationForm,
          restaurant_id,
          user_id,
        });
        
        setShowReservationModal(false);
        Swal.fire({
          icon: "success",
          title: response.data.message,
          text: "Réservation créée avec succès.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        Swal.fire({
          icon: "error",
          title: "Erreur de réservation",
          text: "Une erreur est survenue, veuillez réessayer plus tard.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur de réservation",
        text: "La date et l'heure doivent être dans le futur.",
      });
    }
  };
  
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setRestaurants(allRestaurants);
    } else {
      const filteredRestaurants = allRestaurants.filter(restaurant =>
        (restaurant.nom_Restaurant || '').toLowerCase().includes(searchTerm) ||
        (restaurant.adresse || '').toLowerCase().includes(searchTerm) ||
        (restaurant.directeur || '').toLowerCase().includes(searchTerm) ||
        (restaurant.telephone || '').toLowerCase().includes(searchTerm) ||
        (restaurant.zone_Livraison || '').toLowerCase().includes(searchTerm)
      );
      setRestaurants(filteredRestaurants);
    }
  };
  
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userRole = user ? user.role_id : null;
    const currentPath = window.location.pathname;
  
    if (!user) {
      sessionStorage.setItem('message', "vous devez vous connecter pour accéder à cette page.");
      return <Navigate to="/" replace />;
    } else if (userRole !== 1) {
      sessionStorage.setItem('message', "vos rôles ne vous permettent pas d'accéder à cette page.");
      sessionStorage.setItem('redirectPath', currentPath);
      return <Navigate to="/" replace />;
    }

  const removeDishFromSelection = (indexToRemove) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  console.log(user_id);   
  
  return (
    <div className="font-raleway bg-wood-50 text-wood-900">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('https://www.lapetitevenise.com/themes/themefd12248/images/ACCUEIL.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Nos Restaurants
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Découvrez tous les restaurants disponibles pour votre prochaine expérience culinaire
          </p>

          <div className="w-full max-w-3xl px-4">
            <div className="relative flex items-center">
              <input
                type="text"
                name='search'
                onChange={handleSearch}
                placeholder="Rechercher un restaurant, une spécialité..."
                className="w-full py-4 px-6 rounded-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-opacity-100
                  shadow-lg transition-all duration-300"
              />
              <button
                className="absolute right-2 bg-amber-600 hover:bg-amber-700 text-white 
                  p-2 rounded-full transition-colors duration-300"
                aria-label="Rechercher"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Tous les Restaurants</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-wood-300 border-t-wood-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants?.filter(r => r.status === "accepted").map((restaurant) => (
                <div key={restaurant.id} className="bg-wood-50 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                  <div className="relative">
                    <img
                      src={`http://localhost:8000/storage/${restaurant.image}`}
                      alt={restaurant.nom_Restaurant}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-wood-700 text-white text-xs font-bold px-2 py-1 rounded">
                      {restaurant.adresse}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={`http://localhost:8000/storage/${restaurant.image}`}
                        alt="Logo"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-bold font-serif">{restaurant.nom_Restaurant}</h3>
                        <p className="text-sm text-wood-600">{restaurant.directeur}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-wood-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {restaurant.telephone}
                      </div>
                    </div>

                    <p className="text-wood-700 mb-4">Zone de livraison : {restaurant.zone_Livraison}</p>

                    <div className="flex justify-between items-center">
                      <Link to={`/menu/${restaurant.id}`} className="text-wood-700 hover:text-wood-900 font-semibold">
                        Voir le menu →
                      </Link>
                      <button
                        className="bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        onClick={() => {
                          setSelectedRestaurantId(restaurant.id);
                          setShowReservationModal(true);
                        }}
                      >
                        Réserver Table
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <TableReservationModal
            showModal={showReservationModal}
            closeModal={() => setShowReservationModal(false)}
            reservationForm={reservationForm}
            handleReservationChange={handleReservationChange}
            handleReservationSubmit={handleReservationSubmit}
            selectedDishes={selectedDishes}
            removeDishFromSelection={removeDishFromSelection}
          />

          <Pagination links={links} onPageChange={fetchData} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantsPage;

