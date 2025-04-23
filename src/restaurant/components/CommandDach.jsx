import React, { useEffect, useState } from "react";
import axios from "axios";

const CommandDash = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/commandes/"); 
      console.log(response);
      
      setCommandes(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes :", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommandes = commandes.filter((cmd) =>
    cmd.id.toString().includes(search) || cmd.instructions?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="commandes" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-wood-800">Gestion des Commandes</h3>
        <button className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center btn-text">
          <i className="bx bx-plus mr-2"></i> Nouvelle Commande
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
        <div className="p-4 border-b border-wood-100 bg-wood-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="bx bx-filter text-wood-600"></i>
            <span className="font-medium text-wood-700">Filtrer</span>
            <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
              <option>Toutes les Commandes</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
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
            <button className="bg-wood-100 hover:bg-wood-200 text-wood-700 px-3 py-1 rounded-md text-sm btn-text">
              Rechercher
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-wood-600">Chargement...</div>
          ) : (
            <table className="min-w-full divide-y divide-wood-200">
              <thead className="bg-wood-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Commande #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Prix Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Instructions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-wood-200">
                {filteredCommandes.map((commande) => (
                  <tr key={commande.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-wood-900">#{commande.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">{commande.quantite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">Table {commande.table_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">{commande.prixTotal} €</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        commande.statut === "en_attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : commande.statut === "en_cours"
                          ? "bg-blue-100 text-blue-800"
                          : commande.statut === "terminee"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {commande.statut.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">{commande.instructions || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">
                      {new Date(commande.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-wood-600 hover:text-wood-900">
                          <i className="bx bx-show"></i>
                        </button>
                        <button className="text-wood-600 hover:text-wood-900">
                          <i className="bx bx-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
    </section>
  );
};

export default CommandDash;
