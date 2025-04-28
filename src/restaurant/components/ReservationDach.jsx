import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import UpdateReservationStatusModal from "./UpdateReservationStatusModal";
import { Link } from "react-router-dom";
import HeaderDach from "./layout/headerDach";

const ReservationDash = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const restaurantId = 2;
  const API_BASE_URL = "http://localhost:8000/api";

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/reservations/${restaurantId}`
      );
      console.log(response);
      
      setReservations(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations :", error);
      Swal.fire({
        title: "Erreur",
        text: "Impossible de charger les réservations",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement cette réservation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/reservations/${id}/restaurant/${restaurantId}`);
        setReservations((prev) =>
          prev.filter((reservation) => reservation.id !== id)
        );
        Swal.fire({
          title: "Supprimé !",
          text: "La réservation a été supprimée avec succès.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        Swal.fire({
          title: "Erreur",
          text: "Une erreur est survenue lors de la suppression.",
          icon: "error",
        });
      }
    }
  };

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowUpdateModal(true);
  };

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.id.toString().includes(search.toLowerCase()) ||
      reservation.status.toLowerCase().includes(search.toLowerCase()) ||
      (reservation.name &&
        reservation.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-wood-50">
    <div className="min-h-screen flex">
      {/* Sidebar desktop */}
      <aside className={`w-64 bg-wood-800 text-white fixed h-full z-10  md:block`}>
        <div className="p-4 border-b border-wood-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
              <i className="bx bx-restaurant text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
              <p className="text-xs text-wood-300">Gestion Restaurant</p>
            </div>
          </div>
        </div>

     
        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
        
          <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-receipt text-xl mr-3"></i>
            <span>Gestion des Commandes</span>
          </Link>
          <Link to="/reservations" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
            <i className="bx bxs-calendar-check text-xl mr-3"></i>
            <span>Gestion des Réservations</span>
          </Link>
          <Link to="/plats" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-bowl-hot text-xl mr-3"></i>
            <span>Gestion des Plats</span>
          </Link>
          <Link to="/ingredients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-basket text-xl mr-3"></i>
            <span>Gestion des Ingrédients</span>
          </Link>
          <Link to="/categories" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bxs-category text-xl mr-3"></i>
          <span>Gestion des Categories</span>
          </Link>
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bx-chair text-xl mr-3"></i>
          <span>Gestion des Table</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
          <Link to="/profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-user-circle text-xl mr-3"></i>
            <span>Profil</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
          <a href="#logout" className="flex items-center text-wood-300 hover:text-white">
            <i className="bx bx-log-out text-xl mr-3"></i>
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>


      <div className={`fixed inset-0 bg-black bg-opacity-50 -z-30`}>
        <div className="bg-wood-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-300 -translate-x-full">
          <div className="p-4 border-b border-wood-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                <i className="bx bx-restaurant text-xl"></i>
              </div>
              <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
            </div>
            
          </div>

       <nav className="mt-6">
          <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
        
          <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-receipt text-xl mr-3"></i>
            <span>Gestion des Commandes</span>
          </Link>
          <Link to="/reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-calendar-check text-xl mr-3"></i>
            <span>Gestion des Réservations</span>
          </Link>
          <Link to="/plats" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-bowl-hot text-xl mr-3"></i>
            <span>Gestion des Plats</span>
          </Link>
          <Link to="/ingredients" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
            <i className="bx bxs-basket text-xl mr-3"></i>
            <span>Gestion des Ingrédients</span>
          </Link>
          <Link to="/categories" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bxs-category text-xl mr-3"></i>
          <span>Gestion des Categories</span>
          </Link>
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bx-chair text-xl mr-3"></i>
          <span>Gestion des Table</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
          <Link to="/profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-user-circle text-xl mr-3"></i>
            <span>Profil</span>
          </Link>
        </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <HeaderDach />
          {/* Reservations Section */}
          <section className="m-9">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-wood-800">
                Liste des réservations
              </h3>

            </div>

            {/* Reservations Table */}
            <div className="bg-white rounded-lg shadow-sm border border-wood-100 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wood-600"></div>
                  <p className="mt-2 text-wood-600">
                    Chargement des réservations...
                  </p>
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="bx bx-calendar text-4xl text-wood-400 mb-2"></i>
                  <p className="text-wood-600">Aucune réservation trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-wood-200">
                    <thead className="bg-wood-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Date/Heure
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Personnes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Demandes spéciales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-wood-200">
                      {filteredReservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="hover:bg-wood-50 transition duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-wood-900">
                            {reservation.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-wood-700">
                            {reservation.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-wood-700">
                            {new Date(reservation.date).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-wood-700">
                            {reservation.guests} personnes
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reservation.status === "Confirmée"
                                  ? "bg-green-100 text-green-800"
                                  : reservation.status === "Annulée"
                                  ? "bg-red-100 text-red-800"
                                  : reservation.status === "Terminée"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-wood-700">
                            {reservation.special_requests || "Aucune"}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleEditClick(reservation)}
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Modifier"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(reservation.id)}
                                className="text-red-600 hover:text-red-800 transition"
                                title="Supprimer"
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}


      {showUpdateModal && selectedReservation && (
        <UpdateReservationStatusModal
          reservation={selectedReservation}
          closeModal={() => setShowUpdateModal(false)}
          fetchReservations={fetchReservations}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default ReservationDash;