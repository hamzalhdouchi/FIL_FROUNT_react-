import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import OrderModal from './components/FormCommend';
import Notification from './components/notification';
import Header from './components/layout/header';
import Footer from './components/footer';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import MesCommandesButtonLIVR from './components/mesCommandsLivre';
import restaurantVidio from '../asset/videos/vedioLivre.mp4';
import TableReservationModal from './components/FormReservation';

const RestaurantMenuClient = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showplateModal, setShowplateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedplatees, setSelectedplatees] = useState([]);
  const [currentplate, setCurrentplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [user_id, setUser] = useState(0);
  
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 0,
    special_requests: '',
    preorderCheck: false
  });

  const [plateModalState, setplateModalState] = useState({
    quantity: 1,
    notes: '',
    addToReservation: false
  });

  const [dishModalState, setDishModalState] = useState({
    quantity: 1,
    notes: '',
    addToReservation: false
  });

  const { restaurant_id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      let menuResponse, categoryResponse;
    
      if (token === null) {
        [menuResponse, categoryResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/restaurants/${restaurant_id}/menus`),
          axios.get(`http://127.0.0.1:8000/api/categories/${restaurant_id}`),
        ]);
      } else {
        [menuResponse, categoryResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/restaurants/${restaurant_id}/menus`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://127.0.0.1:8000/api/categories/${restaurant_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
      }
    console.log(menuResponse);
    
      const allPlates = [];
      menuResponse.data.data.menu.forEach(menu => {
        if (menu.plate && menu.plate.length > 0) {
          allPlates.push(...menu.plate.map(plate => ({
            ...plate,
            category: plate.categorie.mon_categorie
          })));
        }
      });
    
      setMenus(allPlates);
      setCategories(categoryResponse.data);
      setLoading(false);
    
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [restaurant_id, token]);

  useEffect(() => {
    fetchData();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('date')?.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }, [fetchData]);

  const openTableReservationModal = useCallback(() => setShowTableModal(true), []);
  const closeTableReservationModal = useCallback(() => setShowTableModal(false), []);

  const openplateOrderModal = useCallback((plate) => {
    setCurrentplate(plate);
    setplateModalState({
      quantity: 1,
      notes: '',
      addToReservation: false
    });
    setShowplateModal(true);
  }, []);

  const closeplateOrderModal = useCallback(() => {
    setShowplateModal(false);
    setCurrentplate(null);
  }, []);

  const displayToast = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const addplateToSelection = useCallback(() => {
    if (!currentplate) return;

    const newplate = {
      ...currentplate,
      quantity: plateModalState.quantity,
      notes: plateModalState.notes
    };

    setSelectedplatees(prev => {
      const existingIndex = prev.findIndex(d => d.id === newplate.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newplate.quantity;
        updated[existingIndex].notes = newplate.notes;
        return updated;
      }
      return [...prev, newplate];
    });
    
    displayToast(`${newplate.nom_plat} ajouté à votre commande`);
    closeplateOrderModal();
  }, [currentplate, plateModalState, displayToast, closeplateOrderModal]);

  const removeplateFromSelection = useCallback((index) => {
    setSelectedplatees(prev => prev.filter((_, i) => i !== index));
    displayToast('Plat retiré de votre commande');
  }, [displayToast]);

  const handleplateModalChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setplateModalState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleQuantityChange = useCallback((amount) => {
    setplateModalState(prev => {
      const newQuantity = prev.quantity + amount;
      if (newQuantity < 1 || newQuantity > 10) return prev;
      return { ...prev, quantity: newQuantity };
    });
  }, []);

  const handleCommandeSubmit = useCallback(async () => {
    const totalQuantite = selectedplatees.reduce((sum, plate) => sum + parseInt(plate.quantity), 0);
    const totalPrix = selectedplatees.reduce((sum, plate) => sum + (plate.prix * parseInt(plate.quantity)), 0);

    const commandeData = {
      statut: 'en_attente',
      quantite: totalQuantite,
      instructions: selectedplatees.map(plate =>
        `${plate.quantity}x ${plate.nom_plat}${plate.notes ? ` (${plate.notes})` : ''}`
      ).join(', '),
      prixTotal: totalPrix,
      restaurant_id: parseInt(restaurant_id),
      CommandStatus: 'livraison',
      plats: selectedplatees.map(plate => ({
        plat_id: plate.id,
        quantite: parseInt(plate.quantity),
        notes: plate.notes,
      }))
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/commandes', commandeData);

      Swal.fire({
        icon: 'success',
        title: 'Commande passée!',
        text: 'Votre commande a été enregistrée avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      
      setSelectedplatees([]);
      setShowOrderSummary(false);

    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Une erreur est survenue lors de la commande',
      });
    }
  }, [selectedplatees, restaurant_id]);

  const addDishToSelection = useCallback(() => {
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

    if (dishModalState.addToReservation) {
      setReservationForm(prev => ({ ...prev, preorderCheck: true }));
      if (!showTableModal) {
        openTableReservationModal();
      }
    }
  }, [currentDish, dishModalState, showTableModal, openTableReservationModal]);

  const removeDishFromSelection = useCallback((index) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleReservationChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setReservationForm(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : (type === 'checkbox' ? checked : value)
    }));
  }, []);

  const handleReservationSubmit = useCallback(async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const user_idU = user?.id || 0;
    setUser(user_idU);

    const reservationDate = new Date(`${reservationForm.date} ${reservationForm.time}`);

    if (reservationDate > new Date()) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/reservations", {
          ...reservationForm,
          restaurant_id: parseInt(restaurant_id),
          user_id: user_idU
        });
        
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
  }, [reservationForm, restaurant_id]);

  const calculateTotal = useCallback(() => {
    return selectedplatees.reduce((total, plate) => total + (plate.prix * plate.quantity), 0);
  }, [selectedplatees]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-wood-700 border-solid"></div>
      </div>
    );
  }

  if (error) return <div className="text-center py-20 text-red-500">Erreur: {error}</div>;

  return (
    <div className="font-raleway bg-wood-50 text-wood-900">
      <Header />

      <section className="relative h-[50vh] bg-cover bg-center" >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          preload="auto"
        >
                    <source src={restaurantVidio} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <div className="mb-4">
            <span className="inline-block px-4 font-layfair py-1 bg-wood-700 text-white text-sm font-medium rounded-full">Maroc</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-layfair font-bold mb-4">Serve Livraison</h1>
          <p className="text-xl md:text-2xl mb-8 font-layfair max-w-2xl">Profitez de nos plats d'exception livrés directement chez vous, avec rapidité, soin et élégance.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowOrderSummary(false)}
              className="bg-wood-500 hover:bg-wood-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              Votre Commande
            </button>
          </div>
        </div>
      </section>

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
                        <img 
                            src={`http://localhost:8000/storage/${menu.image}`}
                          alt={menu.nom_plat} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold font-serif">{menu.nom_plat}</h3>
                          <span className="font-semibold text-wood-700">{menu.prix}€</span>
                        </div>
                        <p className="text-wood-600 mb-2">{menu.desciption}</p>
                        <div className="flex items-center justify-between">
                          <button 
                            className="bg-wood-500 hover:bg-wood-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                            onClick={() => openplateOrderModal(menu)}
                          >
                            Commander
                          </button>
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

      {/* Panier flottant */}
      {selectedplatees.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="bg-wood-700 text-white p-4 rounded-full shadow-lg hover:bg-wood-800 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {selectedplatees.reduce((total, plate) => total + plate.quantity, 0)}
            </span>
          </button>
        </div>
      )}

      {/* Résumé de la commande */}
      {showOrderSummary && (
        <div className="fixed bottom-20 right-4 bg-white p-6 rounded-lg shadow-xl z-50 w-96 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Votre Commande</h3>
            <button onClick={() => setShowOrderSummary(false)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 mb-4">
            {selectedplatees.map((plate, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{plate.quantity}x {plate.nom_plat}</p>
                  {plate.notes && <p className="text-sm text-gray-500">Note: {plate.notes}</p>}
                </div>
                <div className="flex items-center">
                  <span className="mr-4">{(plate.prix * plate.quantity).toFixed(2)}€</span>
                  <button 
                    onClick={() => removeplateFromSelection(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{calculateTotal().toFixed(2)}€</span>
            </div>
          </div>
          
          <button
            onClick={() => handleCommandeSubmit()}
            className="w-full bg-wood-700 hover:bg-wood-800 text-white py-2 rounded-lg transition-colors"
          >
            Passer la commande
          </button>
        </div>
      )}

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
        showModal={showplateModal}
        closeModal={closeplateOrderModal}
        currentplate={currentplate}
        plateModalState={plateModalState}
        handleplateModalChange={handleplateModalChange}
        handleQuantityChange={handleQuantityChange}
        addplateToSelection={addplateToSelection}
      />


      <Notification
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

          <MesCommandesButtonLIVR
        restaurant_id={restaurant_id}
        openTableReservationModal={openTableReservationModal}
      />

      <Footer />
    </div>
  );
};

export default RestaurantMenuClient;