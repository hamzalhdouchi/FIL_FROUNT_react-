import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/layout/header.jsx';
import TableReservationModal from './components/FormReservation.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';

const ReservationsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [reservations, setReservations] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [user, setUser] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    special_requests: '',
    preorder_check: false
  });

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reservations/user/${user.id}`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const allReservations = response.data.data || [];
      
      console.log(allReservations);
      
      const now = new Date();

      setReservations({
        upcoming: allReservations.filter(res =>
          res.status === 'En attente de confirmation' || res.status === 'Confirmée'
        ),
        past: allReservations.filter(res => {
          const reservationDate = new Date(`${res.date} ${res.time}`);
          return reservationDate < now && res.status === 'Terminée';
        }),
        cancelled: allReservations.filter(res => res.status === 'Annulée')
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Impossible de charger les réservations",
      });
    } 
  }, [user]);

  useEffect(() => {
    fetchReservations();
    setIsLoading(false);
  }, [fetchReservations]);

  const handleCancel = async (reservationId) => {
    const result = await Swal.fire({
      title: 'Confirmer l\'annulation',
      text: "Voulez-vous vraiment annuler cette réservation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bd8c5e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non'
    });

    if (!result.isConfirmed) return;

    try {
      const status = 'Annulée';
      const token = sessionStorage.getItem('token');

      await axios.put(
        `http://127.0.0.1:8000/api/reservations/${reservationId}/status`, 
        { status },  
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReservations(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(res => res.id !== reservationId),
        cancelled: [...prev.cancelled, 
          prev.upcoming.find(res => res.id === reservationId)]
      }));

      Swal.fire({
        icon: "success",
        title: "Réservation annulée",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Cancel error:', error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Échec de l'annulation",
      });
    }
  };

  const handleModify = (reservation) => {
    setEditingReservation(reservation);
    setReservationForm({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date.split(' ')[0], 
      time: reservation.time || reservation.date.split(' ')[1] || '',
      guests: reservation.guests,
      special_requests: reservation.special_requests || '',
      preorder_check: reservation.preorder_check || false
    });
    setSelectedDishes(reservation.preorderedDishes || []);
    setShowReservationModal(true);
  };

  const handleReservationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReservationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    const reservationDateTime = new Date(`${reservationForm.date} ${reservationForm.time}`);
    if (reservationDateTime <= new Date()) {
      return Swal.fire({
        icon: "error",
        title: "Date invalide",
        text: "La réservation doit être dans le futur",
      });
    }

    try {
      const token = sessionStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:8000/api/reservations/${editingReservation.id}`,
        {
          ...reservationForm,
          date: `${reservationForm.date} ${reservationForm.time}`,
          preorderedDishes: selectedDishes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Modification réussie",
        showConfirmButton: false,
        timer: 1500
      });

      setShowReservationModal(false);
      await fetchReservations();
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Échec de la modification",
      });
    }
  };

  const removeDishFromSelection = (index) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  };

  const handleReview = (reservationId) => {
    Swal.fire({
      title: 'Donnez votre avis',
      input: 'textarea',
      inputPlaceholder: 'Décrivez votre expérience...',
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      confirmButtonColor: '#bd8c5e',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Merci pour votre avis !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

  const handleRebook = async (reservation) => {
    Swal.fire({
      title: 'Recréer cette réservation ?',
      text: `Souhaitez-vous recréer votre réservation chez ${reservation.restaurantName} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#bd8c5e',
      confirmButtonText: 'Oui, réserver',
      cancelButtonText: 'Non'
    }).then(async (result) => {  
      if (!result.isConfirmed) return;  

      try {
        const status = 'En attente de confirmation';
        const token = sessionStorage.getItem('token');
  
        await axios.put(
          `http://127.0.0.1:8000/api/reservations/${reservation.id}/status`, 
          { status },  
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setReservations(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(res => res.id !== reservation.id),
          cancelled: [...prev.cancelled, reservation]
        }));
  
        Swal.fire({
          icon: "success",
          title: "la recréation est réussie",
          showConfirmButton: false,
          timer: 1500
        });

        await fetchReservations();
      } catch (error) {
        console.error('Error during rebooking:', error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.response?.data?.message || "Échec de la recréation de la réservation",
        });
      }
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmée': return 'bg-green-100 text-green-800';
      case 'En attente de confirmation': return 'bg-yellow-100 text-yellow-800';
      case 'Annulée': return 'bg-red-100 text-red-800';
      case 'Terminée': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmée': return 'bx bx-check-circle';
      case 'En attente de confirmation': return 'bx bx-time';
      case 'Annulée': return 'bx bx-x-circle';
      case 'Terminée': return 'bx bx-check';
      default: return 'bx bx-info-circle';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const ReservationCard = ({ reservation, type }) => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.01]">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-serif">{reservation.restaurantName}</h2>
                  <p className="text-gray-600">Réservation #{reservation.id}</p>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(reservation.status)}`}>
                  <i className={`${getStatusIcon(reservation.status)} mr-2`}></i>
                  {reservation.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {type === 'cancelled' ? 'Date prévue' : 'Date & Heure'}
                  </p>
                  <p className="font-medium">{reservation.date}</p>
                </div>
                <div>
                  <p className="text-sm font-serif text-gray-500">Personnes</p>
                  <p className="font-medium">{reservation.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {type === 'cancelled' ? 'Annulée le' : 'Votre nom'}
                  </p>
                  <p className="font-medium">
                    {type === 'cancelled' 
                      ? (reservation.updated_at 
                          ? dayjs(reservation.updated_at).format('DD MMMM YYYY à HH:mm') 
                          : 'N/A')
                      : reservation.name}
                  </p>
                </div>
              </div>

              {type === 'upcoming' && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium font-serif text-gray-800 mb-1">Demandes spéciales</h3>
                  <p className="text-gray-600">
                    {reservation.special_requests || 'Aucune demande particulière'}
                  </p>
                </div>
              )}

              {type === 'upcoming' && reservation.preorderedDishes?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium font-serif text-gray-800 mr-2">Plats précommandés</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {reservation.preorderedDishes.length} plats
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reservation.preorderedDishes.map((dish, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {type === 'upcoming' && (
                  <>
                    <button 
                      onClick={() => handleModify(reservation)}
                      className="bg-wood-500 hover:bg-wood-600 font-serif text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <i className="bx bx-edit mr-2"></i>
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleCancel(reservation.id)}
                      className="bg-white hover:bg-red-50 font-serif text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <i className="bx bx-x mr-2"></i>
                      Annuler
                    </button>
                  </>
                )}

                {type === 'past' && (
                  <>
                    <button 
                      onClick={() => handleReview(reservation.id)}
                      className="bg-wood-500 hover:bg-wood-600 font-serif text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <i className="bx bx-star mr-2"></i>
                      Laisser un avis
                    </button>
                    <button 
                      onClick={() => handleRebook(reservation)}
                      className="bg-white hover:bg-gray-50 font-serif text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <i className="bx bx-calendar mr-2"></i>
                      Réserver à nouveau
                    </button>
                  </>
                )}

                {type === 'cancelled' && (
                  <button 
                    onClick={() => handleRebook(reservation)}
                    className="bg-wood-500 hover:bg-wood-600 font-serif text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <i className="bx bx-calendar mr-2"></i>
                    Réserver à nouveau
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wood-500"></div>
        </div>
      );
    }

    const currentReservations = reservations[activeTab];
    const emptyStates = {
      upcoming: {
        icon: 'bx-calendar',
        title: 'Aucune réservation à venir',
        text: 'Vous n\'avez aucune réservation prévue pour le moment.',
        showButton: true
      },
      past: {
        icon: 'bx-history',
        title: 'Aucune réservation passée',
        text: 'Vous n\'avez encore effectué aucune réservation.',
        showButton: false
      },
      cancelled: {
        icon: 'bx-x-circle',
        title: 'Aucune réservation annulée',
        text: 'Vous n\'avez annulé aucune réservation.',
        showButton: false
      }
    };

    if (currentReservations.length === 0) {
      const { icon, title, text, showButton } = emptyStates[activeTab];
      return (
        <div className="text-center py-12">
          <i className={`bx ${icon} text-5xl text-gray-400 mb-4`}></i>
          <h3 className="text-xl font-medium text-gray-700">{title}</h3>
          <p className="text-gray-500 mt-2">{text}</p>
          {showButton && (
            <Link 
              to="/restaurants" 
              className="mt-4 inline-block bg-wood-500 hover:bg-wood-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Réserver une table
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentReservations.map(reservation => (
          <ReservationCard 
            key={reservation.id} 
            reservation={reservation} 
            type={activeTab} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <header className="relative bg-gradient-to-r from-wood-50 to-white py-10 border-b border-wood-200 shadow-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wood-400 to-wood-600"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center text-wood-700 hover:text-wood-900 transition-all duration-300 mr-4 -ml-2 p-2 rounded-full hover:bg-wood-100"
              aria-label="Retour à la page précédente"
            >
              <span className="flex items-center justify-center bg-wood-100 group-hover:bg-wood-200 rounded-full p-1.5 transition-all duration-300">
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </span>
              <span className="font-medium ml-1 text-lg">Retour</span>
            </button>
          </div>

          <div className="mt-6 md:mt-0 text-center md:text-right">
            <div className="inline-block px-3 py-1 bg-wood-100 text-wood-800 text-xs font-medium rounded-full mb-2">
              Espace Personnel
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center md:text-left max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-wood-900 tracking-tight">
            Mes Réservations
          </h1>
          <div className="h-1 w-20 bg-wood-500 mx-auto md:mx-0 my-4 rounded-full"></div>
          <p className="text-wood-700 text-lg md:text-xl mt-2 font-light">
            Consultez et gérez vos réservations passées et à venir en toute simplicité
          </p>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-wood-200 to-transparent"></div>
    </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'upcoming', label: 'À venir' },
              { id: 'past', label: 'Passées' },
              { id: 'cancelled', label: 'Annulées' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === tab.id 
                    ? 'border-wood-500 text-wood-700' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </main>

      {showReservationModal && (
        <TableReservationModal
          showModal={showReservationModal}
          closeModal={() => {
            setShowReservationModal(false);
            setEditingReservation(null);
          }}
          reservationForm={reservationForm}
          handleReservationChange={handleReservationChange}
          handleReservationSubmit={handleReservationSubmit}
          selectedDishes={selectedDishes}
          removeDishFromSelection={removeDishFromSelection}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ReservationsPage;