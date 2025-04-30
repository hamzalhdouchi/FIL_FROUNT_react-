        import React, { useEffect, useState } from "react";
        import axios from "axios";
        import Swal from "sweetalert2";
        import { Link } from "react-router-dom";
        import HeaderDach from "./components/layout/headerDach";
import UserProfile from "./profiel";

        const LivreurDash = () => {
        const [commandes, setCommandes] = useState([]);
        const [loading, setLoading] = useState(true);
        const [search, setSearch] = useState("");
        const [filtreStatut, setFiltreStatut] = useState("");
        const [showStatusModal, setShowStatusModal] = useState(false);
        const [selectedCommande, setSelectedCommande] = useState(null);
        const [newStatut, setNewStatut] = useState("");
        const [restaurant_id, setRestaurant_id] = useState(0);
        const [restaurant_idRT, setRestaurant_idR] = useState(0);
          const [showProfile, setShowProfile] = useState(false);
          const [user, setUser] = useState(null);
          

        useEffect(() => {
            fetchCommandes();
        }, []);

        const fetchCommandes = async () => {
            try {
            const response = await axios.get("http://localhost:8000/api/commandes");
            
            setCommandes(response.data.commande);
            } catch (error) {
            console.error("Erreur lors du chargement des commandes :", error);
            } finally {
            setLoading(false);
            }
        };

        
    const openStatusModal = (commande) => {
        setSelectedCommande(commande);
        setNewStatut(commande.statut);
        setShowStatusModal(true);
    };

    
    const handleChangeStatut = async () => {
        console.log(newStatut);
        console.log(selectedCommande.id);
        const user = JSON.parse(sessionStorage.getItem('user'))
        const user_id = user.id
        try {
        await axios.put(`http://localhost:8000/api/commandes/${selectedCommande.id}/change_action`, {
            action: newStatut,
        });
        await axios.put(`http://localhost:8000/api/commandes/${selectedCommande.id}/assign-livreur`, {
            livreur_id: user_id
          });
        Swal.fire("Succès", "Le statut a été mis à jour", "success");
        setShowStatusModal(false);
        fetchCommandes();
        } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue", "error");
        }
    };


    

        const filteredCommandes = commandes.filter((cmd) => {
            const matchSearch =
            cmd.id.toString().includes(search) ||
            cmd.instructions?.toLowerCase().includes(search.toLowerCase());

            const matchStatut = !filtreStatut || cmd.statut === filtreStatut;

            return matchSearch && matchStatut;
        });
        console.log(filteredCommandes);

        
        useEffect(() => {
            const token = sessionStorage.getItem("token");
            const userData = JSON.parse(sessionStorage.getItem("user"));
            if (userData) {
            setUser(userData);
            }
        }, []);
        

        return (
            <div className="bg-wood-50 min-h-screen flex">
            <aside className="w-64 bg-wood-800 text-white fixed h-full z-10 hidden md:block">
                <div className="p-4 border-b border-wood-700 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                    <i className="bx bx-restaurant text-xl"></i>
                </div>
                <div>
                    <h1 className="font-bold text-lg">Serve Quick</h1>
                    <p className="text-xs text-wood-300">Gestion Restaurant</p>
                </div>
                </div>

                <nav className="mt-6">
                <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
                <Link to="/dashboard" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700">
                    <i className="bx bxs-dashboard text-xl mr-3"></i>
                    <span>Tableau de Bord</span>
                </Link>
                <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
                    <i className="bx bxs-receipt text-xl mr-3"></i>
                    <span>Gestion des Commandes</span>
                </Link>
                
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

            <div className="flex-1 md:ml-64">
                <HeaderDach />

                <section id="commandes" className="m-8 p-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-wood-800">Gestion des Commandes</h3>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
                    <div className="p-4 border-b border-wood-100 bg-wood-50 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <i className="bx bx-filter text-wood-600"></i>
                        <span className="font-medium text-wood-700">Filtrer</span>
                        <select
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1"
                        >
                        <option value="">Toutes les Commandes</option>
                        <option value="accepte">accepte</option>
                        <option value="refusé">refusé</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher commandes..."
                        className="border border-wood-200 rounded-md text-sm px-3 py-1"
                        />
                    </div>
                    </div>

                    <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-6 text-center text-wood-600">Chargement...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-wood-200">
                        <thead className="bg-wood-50">
                            <tr>
                            {["Commande #", "Quantité", "Table", "Prix Total", "Statut", "Instructions", "Date", "Action"].map((col) => (
                                <th
                                key={col}
                                className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider"
                                >
                                {col}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-wood-200">
                            {filteredCommandes
                                .filter((commande) => commande.livreur_id === user.id || commande.statut === "livraison")
                                .map((commande) => (

                            <tr key={commande.id}>
                                <td className="px-6 py-4 text-sm font-medium text-wood-900">#{commande.id}</td>
                                <td className="px-6 py-4 text-sm text-wood-700">{commande.quantite}</td>
                                <td className="px-6 py-4 text-sm text-wood-700">Table {commande.table_number}</td>
                                <td className="px-6 py-4 text-sm text-wood-700">{commande.prixTotal} €</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                        commande?.action === "refusé"
                                            ? "bg-yellow-100 text-red-800"
                                            : commande?.action === "accepte"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {commande?.action ? commande.action.replace("_", " ") : "Statut inconnu"}
                                    </span>
                                    </td>

                                <td className="px-6 py-4 text-sm text-wood-700">{commande.instructions || "—"}</td>
                                <td className="px-6 py-4 text-sm text-wood-700">
                                {new Date(commande.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                            <button onClick={() => openStatusModal(commande)} className="text-wood-600 hover:text-wood-900">
                            <i className="bx bx-edit"></i>
                            </button>
                            <button className="text-wood-600 hover:text-wood-900">
                            <i className="bx bx-show"></i>
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
                </section>
                {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Changer le statut</h2>
                <select
                value={newStatut}
                onChange={(e) => setNewStatut(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                >
                <option value="accepte">accepte</option>
                <option value="refusé">refuse</option>
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
            </div>

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

        export default LivreurDash;
