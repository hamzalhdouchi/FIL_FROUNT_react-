import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import HeaderDach from "./layout/headerDach";

const STATUS_OPTIONS = [
  { value: "", label: "Toutes les Commandes" },
  { value: "en_attente", label: "En attente" },
  { value: "en_cours", label: "En cours" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" }
];

const StatusBadge = ({ status }) => {
  const statusClasses = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_cours: "bg-blue-100 text-blue-800",
    terminee: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800"
  };

  return (
    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-medium text-wood-700">{title}</h4>
      <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <i className={`${icon} text-2xl text-${color}-600`}></i>
      </div>
    </div>
    <p className="text-3xl font-bold text-wood-900 mb-1">{value}</p>
    <div className="flex items-center text-sm">
      <span className="text-green-500 flex items-center">
        <i className='bx bx-up-arrow-alt'></i> {trend}
      </span>
      <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
    </div>
  </div>
);

const CommandDash = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [newStatut, setNewStatut] = useState("");
  const [stats, setStats] = useState({
    totalPrixCommandes: 0,
    totalCommandes: 0,
    totalReservations: 0,
    totalPlats: 0
  });

  const restaurant = useMemo(() => {
    return JSON.parse(sessionStorage.getItem('restaurant')) || {};
  }, []);

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/commandes/restaurant/${restaurant.id}`);
      setCommandes(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes :", error);
      Swal.fire("Erreur", "Impossible de charger les commandes", "error");
    } finally {
      setLoading(false);
    }
  }, [restaurant.id]);

  const fetchStats = useCallback(async () => {
    try {
      const menu = JSON.parse(sessionStorage.getItem('menu')) || [];
      const menu_id = menu[0]?.id;
      
      const [totPxRes, totCRes, totRes, totPlat] = await Promise.all([
        axios.get(`http://localhost:8000/api/statistiques/total-prix-commandes/${restaurant.id}`),
        axios.get(`http://localhost:8000/api/statistiques/commandes/${restaurant.id}`),
        axios.get(`http://localhost:8000/api/statistiques/total-reservations/${restaurant.id}`),
        menu_id ? axios.get(`http://localhost:8000/api/statistiques/total-plat/${menu_id}`) : { data: 0 }
      ]);
      
      setStats({
        totalPrixCommandes: totPxRes.data.total_prix_commandes,
        totalCommandes: totCRes.data.total,
        totalReservations: totRes.data.total_reservations,
        totalPlats: totPlat.data.total
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  }, [restaurant.id]);

    useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    fetchCommandes();
    fetchStats();
  }, [fetchCommandes, fetchStats]);

  const filteredCommandes = useMemo(() => {
    return commandes.filter((cmd) => {
      const matchSearch =
        cmd.id.toString().includes(search) ||
        (cmd.instructions?.toLowerCase().includes(search.toLowerCase()) )||
        (cmd.table_number?.toString().includes(search));

      const matchStatut = !filtreStatut || cmd.statut === filtreStatut;

      return matchSearch && matchStatut;
    });
  }, [commandes, search, filtreStatut]);

  const handleChangeStatut = async () => {
    try {
      await axios.put(`http://localhost:8000/api/commandes/statut/${selectedCommande.id}`, {
        statut: newStatut,
      });
      Swal.fire("Succès", "Le statut a été mis à jour", "success");
      setShowStatusModal(false);
      fetchCommandes();
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Une erreur est survenue", "error");
    }
  };

  const handleDeleteCommande = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/commandes/${id}`);
        Swal.fire("Succès", "La commande a été supprimée", "success");
        fetchCommandes();
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue", "error");
      }
    }
  };

  const openStatusModal = (commande) => {
    setSelectedCommande(commande);
    setNewStatut(commande.statut);
    setShowStatusModal(true);
  };

  return (
    <div className="bg-wood-50 min-h-screen flex">
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

        <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
          <button onClick={() => {
            sessionStorage.clear();
            window.location.href('/')
          }} className="flex items-center text-wood-300 hover:text-white">
            <i className="bx bx-log-out text-xl mr-3"></i>
            <span>Déconnexion</span>
          </button>
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
        
          <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
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
    </div>
    </div>

      <div className="flex-1 md:ml-64">
        <HeaderDach />
        <section className="m-8 p-8">
        <section className="mb-8">
    <h3 className="text-xl font-bold text-wood-800 mb-4">Aperçu</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Commandes Totales" 
        value={stats.totalCommandes} 
        icon="bx bxs-box" 
        color="olive" 
        trend="15.3%" 
      />
      <StatCard 
        title="Réservations" 
        value={stats.totalReservations} 
        icon="bx bx-calendar"  
        color="wood" 
        trend="8.2%" 
      />
      <StatCard 
        title="Prix Total Commandes (€)" 
        value={stats.totalPrixCommandes} 
        icon="bx bxs-credit-card"
        color="blue" 
        trend="12.7%" 
      />
      <StatCard 
        title="Plats Totaux" 
        value={stats.totalPlats} 
        icon="bx bx-food-menu"
        color="purple" 
        trend="2 nouveaux" 
      />
    </div>
  </section>

          <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
            <div className="p-4 border-b border-wood-100 bg-wood-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-2">
                <i className="bx bx-filter text-wood-600"></i>
                <span className="font-medium text-wood-700">Filtrer</span>
                <select
                  value={filtreStatut}
                  onChange={(e) => setFiltreStatut(e.target.value)}
                  className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher commandes..."
                  className="border border-wood-200 rounded-md text-sm px-3 py-1 pl-8 w-full"
                />
                <i className="bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-wood-400"></i>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood-600"></div>
                  <span className="ml-2 text-wood-600">Chargement des commandes...</span>
                </div>
              ) : filteredCommandes.length === 0 ? (
                <div className="p-6 text-center text-wood-500">Aucune commande trouvée</div>
              ) : (
                <table className="min-w-full divide-y divide-wood-200">
                  <thead className="bg-wood-50">
                    <tr>
                      {["Commande #", "Quantité", "Table", "Prix Total", "Statut", "Instructions", "Date", "Actions"].map((col) => (
                        <th key={col} className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-wood-200">
                    {filteredCommandes.map((commande) => (
                      <tr key={commande.id} className="hover:bg-wood-50">
                        <td className="px-6 py-4 text-sm font-medium text-wood-900">#{commande.id}</td>
                        <td className="px-6 py-4 text-sm text-wood-700">{commande.quantite}</td>
                        <td className="px-6 py-4 text-sm text-wood-700">Table {commande.table_number}</td>
                        <td className="px-6 py-4 text-sm text-wood-700">{commande.prixTotal} €</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={commande.statut} />
                        </td>
                        <td className="px-6 py-4 text-sm text-wood-700 max-w-xs truncate">
                          {commande.instructions || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-wood-700">
                          {new Date(commande.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openStatusModal(commande)} 
                              className="text-wood-600 hover:text-wood-900"
                              title="Modifier le statut"
                            >
                              <i className="bx bx-edit"></i>
                            </button>
                            <button 
                              className="text-wood-600 hover:text-wood-900"
                              title="Voir les détails"
                            >
                              <i className="bx bx-show"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteCommande(commande.id)} 
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <i className="bx bx-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal de changement de statut */}
          {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Changer le statut</h2>
                <select
                  value={newStatut}
                  onChange={(e) => setNewStatut(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                >
                  {STATUS_OPTIONS.filter(opt => opt.value).map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleChangeStatut}
                    className="px-4 py-2 bg-wood-600 text-white rounded hover:bg-wood-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CommandDash;