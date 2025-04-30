import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TableModal from "./formTable";
import UpdateTableModal from "./UPdateTableStatus";
import { Link } from "react-router-dom";
import HeaderDach from "./layout/headerDach";
import UserProfile from "../profiel";

const TableDash = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [restaurant_id, setRestaurant_id] = useState(0);
  const [restaurant_idRT, setRestaurant_idR] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  const fetchTables = async () => {
    const restaurant = JSON.parse(sessionStorage.getItem('restaurant'));  
  const restaurant_idR = restaurant.id;
  setRestaurant_id(restaurant);
  setRestaurant_idR(restaurant_idR);
    try {
      setLoading(true);

      const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurant_idR}/tables`);
      
      setTables(response.data.data); 
    } catch (error) {
      console.error("Erreur lors du chargement des tables :", error);
      Swal.fire({
        title: "Erreur",
        text: "Impossible de charger les tables",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement cette table.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/restaurants/${restaurant_idRT}/tables/${id}`);
        setTables((prev) => prev.filter((table) => table.id !== id));
        Swal.fire({
          title: "Supprimé !",
          text: "La table a été supprimée avec succès.",
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

  const handleEditClick = (table) => {
    setSelectedTable(table);
    setShowUpdateModal(true);
  };

  const filteredTables = tables.filter((table) =>
    table.numeroDeTable.toString().includes(search.toLowerCase()) ||
    table.statut.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

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
          <Link to="/reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
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
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
          <i className="bx bx-chair text-xl mr-3"></i>
          <span>Gestion des Table</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors w-full text-left"
          >
            <i className='bx bxs-user-circle text-xl mr-3'></i>
            <span>Profile</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
          <a href="#logout" className="flex items-center text-wood-300 hover:text-white">
            <i className="bx bx-log-out text-xl mr-3"></i>
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>


      <div className={`fixed inset-0 bg-black bg-opacity-50 -z-20`}>
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
          <Link to="/ingredients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-basket text-xl mr-3"></i>
            <span>Gestion des Ingrédients</span>
          </Link>
          <Link to="/categories" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bxs-category text-xl mr-3"></i>
          <span>Gestion des Categories</span>
          </Link>
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
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

          {/* Tables Section */}
          <section className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-wood-800">Liste des Tables</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <i className="bx bx-plus mr-2"></i> Ajouter une Table
              </button>
            </div>


            {/* Tables Table */}
            <div className="bg-white rounded-lg shadow-sm border border-wood-100 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wood-600"></div>
                  <p className="mt-2 text-wood-600">Chargement des tables...</p>
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="bx bx-table text-4xl text-wood-400 mb-2"></i>
                  <p className="text-wood-600">Aucune table trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-wood-200">
                <thead className="bg-wood-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Numéro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Capacité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Télécharger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-wood-200">
                    {filteredTables.map((table) => (
                    <tr key={table.id} className="hover:bg-wood-50 transition duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-wood-900">{table.id}</td>

                        <td className="px-6 py-4 text-sm text-wood-700 flex items-center gap-2">
                        Table {table.numeroDeTable}
                        </td>

                        <td className="px-6 py-4 text-sm text-wood-700">{table.capacite} personnes</td>

                        <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            table.statut === 'libre'
                            ? "bg-green-100 text-green-800"
                            : table.statut === 'occupee'
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                            {table.statut.charAt(0).toUpperCase() + table.statut.slice(1)}
                        </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-wood-700">
                        <a
                            href={`data:image/png;base64,${table.qrCode}`}
                            download={`qr_table_${table.numeroDeTable}.png`}
                            className="flex items-center text-wood-600 hover:underline hover:text-wood-800 transition"
                        >
                            <i className="bx bx-download mr-1"></i> Télécharger QR
                        </a>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                            <button
                            onClick={() => handleEditClick(table)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Modifier"
                            >
                            <i className="bx bx-edit"></i>
                            </button>
                            <button
                            onClick={() => handleDelete(table.id)}
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

      {/* Create Table Modal */}
      {showCreateModal && (
        <TableModal
          closeModal={() => setShowCreateModal(false)}
          fetchTables={fetchTables}
        />
      )}

        {showUpdateModal && selectedTable && (
        <UpdateTableModal
            closeModal={() => setShowUpdateModal(false)}
            table={selectedTable}
            fetchTables={fetchTables}
        />
        )}


      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-[50vw] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold text-wood-800">User Profile</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="text-wood-600 hover:text-wood-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <UserProfile id_user={user.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDash;