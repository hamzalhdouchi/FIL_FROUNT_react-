import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderModal from './components/FormCommend';
import Notification from './components/notification';
import Header from './components/layout/header';
import Footer from './components/footer';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import MesCommandesButton from './components/MesCommands';




const RestaurantMenuClient = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showplateModal, setShowplateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedplatees, setSelectedplatees] = useState([]);
  const [currentplate, setCurrentplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showOrderSummary, setShowOrderSummary] = useState(false);



  const { restaurant_id } = useParams();
  const { table_id } = useParams();
  
  
  const token = sessionStorage.getItem('token');
  
  const [plateModalState, setplateModalState] = useState({
    quantity: 1,
    notes: '',
    addToReservation: false
  });

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('date')?.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }, [restaurant_id, token]);

  const openTableReservationModal = () => setShowTableModal(true);

  const openplateOrderModal = (plate) => {
    setCurrentplate(plate);
    setplateModalState({
      quantity: 1,
      notes: '',
      addToReservation: false
    });
    setShowplateModal(true);
  };

  const closeplateOrderModal = () => {
    setShowplateModal(false);
    setCurrentplate(null);
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addplateToSelection = () => {
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
  };

  const removeplateFromSelection = (index) => {
    setSelectedplatees(prev => prev.filter((_, i) => i !== index));
    displayToast('Plat retiré de votre commande');
  };

  const handleplateModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setplateModalState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuantityChange = (amount) => {
    setplateModalState(prev => {
      const newQuantity = prev.quantity + amount;
      if (newQuantity < 1 || newQuantity > 10) return prev;
      return { ...prev, quantity: newQuantity };
    });
  };


  const handleCommandeSubmit = async () => {

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
    table_number: parseInt(table_id),  
    CommandStatus: 'aTable',
    plats: selectedplatees.map(plate => ({
      plat_id: plate.id,
      quantite: parseInt(plate.quantity),
      notes: plate.notes,
    }))
  };
  console.log(commandeData);
  

    try {
      await axios.post('http://127.0.0.1:8000/api/commandes', commandeData);

      Swal.fire({
        icon: 'success',
        title: 'Commande passée!',
        text: 'Votre commande a été enregistrée avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      console.log(commandeData);
      
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
  };


  const calculateTotal = () => {
    return selectedplatees.reduce((total, plate) => total + (plate.prix * plate.quantity), 0);
  };

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

  const filteredMenus = activeCategory === 'all'
    ? menus
    : menus.filter(menu => menu.category === activeCategory);

  return (
    <div className="font-raleway bg-wood-50 text-wood-900">
      <Header />

      <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-wood-700 text-white text-sm font-medium rounded-full">Maroc</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-layfair font-bold mb-4">Serve Commandes</h1>
          <p className="text-xl font-layfair md:text-2xl mb-8 max-w-2xl">  Commandez directement depuis votre table et profitez d'un service rapide et attentionné.</p>
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

          <MesCommandesButton
        restaurant_id={restaurant_id}
        table_id={table_id}
      />

      <Footer />
    </div>
  );
};

export default RestaurantMenuClient;