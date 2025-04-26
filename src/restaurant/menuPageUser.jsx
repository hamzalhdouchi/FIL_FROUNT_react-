import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableReservationModal from './components/FormReservation';
import OrderModal from './components/FormCommend';
import Notification from './components/notification';
import Header from './components/layout/header';
import Footer from './components/footer';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const token = sessionStorage.getItem('token');

const RestaurantMenuUser = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTableModal, setShowTableModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [currentDish, setCurrentDish] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: parseInt(0),
    special_requests: '',
    preorderCheck: false
  });

  const { restaurant_id } = useParams();  
  console.log(typeof restaurant_id);
  
  const [user_id, setUser] = useState(0);
  const [dishModalState, setDishModalState] = useState({
    quantity: 1,
    notes: '',
    addToReservation: false
  });

  const restaurant = JSON.parse(sessionStorage.getItem('restaurant'));
  const selectedRestaurant = restaurant ? restaurant.find(r => r.id === parseInt(restaurant_id)) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log(token);
      
        let menuResponse, categoryResponse;
      
        if (token === null) {
          [menuResponse, categoryResponse] = await Promise.all([
            axios.get(`http://127.0.0.1:8000/api/restaurants/${restaurant_id}/menus`),
            axios.get('http://127.0.0.1:8000/api/categories'),
          ]);
        } else {
          [menuResponse, categoryResponse] = await Promise.all([
            axios.get(`http://127.0.0.1:8000/api/restaurants/${restaurant_id}/menus`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://127.0.0.1:8000/api/categories', {
              headers: { Authorization: `Bearer ${token}` }
            }),
          ]);
        }
      
        const allPlates = [];
        menuResponse.data.data.menu.forEach(menu => {
          if (menu.plate && menu.plate.length > 0) {
            allPlates.push(...menu.plate.map(plate => ({
              ...plate,
              category: plate.categorie.mon_categorie
            })));
          }

          console.log(allPlates);
          
        });
      
        setMenus(allPlates);
        setCategories(categoryResponse.data);
        setLoading(false);
      
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
      
    };

    fetchData();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('date')?.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }, [restaurant_id]);

  const openTableReservationModal = () => setShowTableModal(true);
  const closeTableReservationModal = () => setShowTableModal(false);

  const openDishOrderModal = (dish) => {
    setCurrentDish(dish);
    setDishModalState({
      quantity: 1,
      notes: '',
      addToReservation: false
    });
    setShowDishModal(true);
  };

  const closeDishOrderModal = () => {
    setShowDishModal(false);
    setCurrentDish(null);
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const closeToast = () => setShowToast(false);

  const addDishToSelection = () => {
    if (!currentDish) return;

    const newDish = {
      ...currentDish,
      quantity: dishModalState.quantity,
      notes: dishModalState.notes
    };

    setSelectedDishes(prev => {
      const existingIndex = prev.findIndex(d => d.id === newDish.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newDish.quantity;
        updated[existingIndex].notes = newDish.notes;
        return updated;
      }
      return [...prev, newDish];
    });
    
    displayToast(`${newDish.nom_plat} ajouté à votre commande`);

    if (dishModalState.addToReservation) {
      setReservationForm(prev => ({ ...prev, preorderCheck: true }));
      if (!showTableModal) {
        openTableReservationModal();
      }
    }

    closeDishOrderModal();
  };

  const removeDishFromSelection = (index) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  };

  const handleReservationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReservationForm(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : (type === 'checkbox' ? checked : value)
    }));
  };

  const handleDishModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishModalState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuantityChange = (amount) => {
    setDishModalState(prev => {
      const newQuantity = prev.quantity + amount;
      if (newQuantity < 1 || newQuantity > 10) return prev;
      return { ...prev, quantity: newQuantity };
    });
  };


  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user'));
    let user_idU = user.id;
    console.log(user_idU);
    setUser(user_idU);

    const reservation__id = parseInt(restaurant_id);
    const reservationDate = new Date(`${reservationForm.date} ${reservationForm.time}`);

    if (reservationDate > Date.now()) {
      console.log(reservationForm,restaurant_id,user_idU);
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/reservations", {
          ...reservationForm,
          restaurant_id: parseInt(restaurant_id),
          user_id: user_idU
        });
        console.log("Réservation envoyée :", response.data);
        setShowTableModal(false);
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
        text: "La date et l'heure de la réservation doivent être dans le futur.",
      });
    }
  };

  // Filter menus by category
  const filteredMenus = activeCategory === 'all'
    ? menus
    : menus.filter(menu => menu.category === activeCategory);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-wood-700 border-solid"></div>
          </div>
        </div>
      );
    }
     if (error) return <div className="text-center py-20 text-red-500">Erreur: {error}</div>;

    return (
        <div className="font-raleway bg-wood-50 text-wood-900">
        
        <Header />

        <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
            <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-wood-700 text-white text-sm font-medium rounded-full">Maroc</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Serve Quick</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">Une cuisine française raffinée dans un cadre élégant. Spécialités de fruits de mer et vins fins.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <button 
                onClick={openTableReservationModal}
                className="bg-wood-500 hover:bg-wood-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
                >
                Réserver une table
                </button>
                {/* <a href="#" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedRestaurant.adresse}
                </a> */}
            </div>
            </div>
        </section>

        {/* Restaurant Info */}
        {/* <section className="py-8 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wood-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-wood-800">Ouvert: 12h00 - 23h00</span>
                </div>
                <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wood-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-wood-800">{selectedRestaurant.telephone}</span>
                </div>
                <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wood-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-wood-800">{selectedRestaurant.directeur}</span>
                </div>
                <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wood-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-wood-800">{selectedRestaurant.nom_Restaurant}</span>
                </div>
            </div>
            </div>
        </section> */}

        <section className="py-8 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-wood-700 text-white' : 'bg-wood-100 text-wood-700 hover:bg-wood-200'}`}
                onClick={() => setActiveCategory('all')}
                >
                Tous
                </button>
                {categories.map(category => (
                <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.mon_categorie ? 'bg-wood-700 text-white' : 'bg-wood-100 text-wood-700 hover:bg-wood-200'}`}
                    onClick={() => setActiveCategory(category.mon_categorie)}
                >
                    {category.mon_categorie}
                </button>
                ))}
            </div>
            </div>
        </section>
        {/* Menu Section */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            {categories.map(category => {
                const categoryMenus = menus.filter(menu => menu.category === category.mon_categorie);
                if (activeCategory !== 'all' && activeCategory !== category.mon_categorie) return null;
                if (categoryMenus.length === 0) return null;
                
                return (
                <div key={category.id} className="menu-category mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">{category.mon_categorie}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categoryMenus.map(menu => (
                        <div key={menu.id} className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="https://img.freepik.com/photos-premium/tokyo-japon-09-janvier-2018-chefs-cuisinent-dans-restaurant-delicieux-snack-japonais-plus-populaire-au-japon_175935-25.jpg?semt=ais_hybrid&w=740" 
                                alt={menu.nom_plat} 
                                className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold font-serif">{menu.nom_plat}</h3>
                                <span className="font-semibold text-wood-700">{menu.prix}€</span>
                            </div>

                            <p className="text-wood-600 mb-2">{menu.desciption}</p>

                            <div className="flex items-center justify-between">
                                {!token && (
                                <button 
                                    className="bg-wood-500 hover:bg-wood-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                    onClick={() => openDishOrderModal(menu)}
                                >
                                    Réserver
                                </button>
                                )}
                            </div>
                            </div>
                            
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
            </div>
        </section>

        <TableReservationModal
            showModal={showTableModal}
            closeModal={closeTableReservationModal}
            reservationForm={reservationForm}
            handleReservationChange={handleReservationChange}
            handleReservationSubmit={handleReservationSubmit}
            selectedDishes={selectedDishes}
            removeDishFromSelection={removeDishFromSelection}
        />
        
        <OrderModal
            showModal={showDishModal}
            closeModal={closeDishOrderModal}
            currentDish={currentDish}
            dishModalState={dishModalState}
            handleDishModalChange={handleDishModalChange}
            handleQuantityChange={handleQuantityChange}
            addDishToSelection={addDishToSelection}
        />
        
        <Notification
            message={toastMessage}
            show={showToast}
            onClose={closeToast}
        />
        
        <section className="py-16 bg-wood-100">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Réservez votre table</h2>
            <p className="text-wood-700 mb-8 max-w-2xl mx-auto">Pour une expérience gastronomique inoubliable, réservez votre table dès maintenant. Nous vous accueillerons avec plaisir pour vous faire découvrir notre cuisine raffinée.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <button 
                onClick={openTableReservationModal}
                className="bg-wood-700 hover:bg-wood-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
                >
                Réserver maintenant
                </button>
            </div>
            </div>
        </section>
        <Footer />
    </div>
  );
};

export default RestaurantMenuUser;