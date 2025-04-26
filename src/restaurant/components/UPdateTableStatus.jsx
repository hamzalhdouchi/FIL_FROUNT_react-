import React, { useState } from "react";
import axios from "axios";

const UpdateTableModal = ({ closeModal, table, fetchTables }) => {
  const [statut, setStatut] = useState(table.statut);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    try {
      const restaurant = JSON.parse(sessionStorage.getItem("restaurant"));
      if (!restaurant || !restaurant.id) {
        throw new Error("Restaurant non trouvé dans sessionStorage.");
      }

      const restaurant_id = restaurant.id;

      await axios.put(
        `http://localhost:8000/api/restaurants/${restaurant_id}/tables/${table.id}`,
        { statut }
      );

      fetchTables(); // appel à la prop passée, pas une redéclaration
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-wood-700 mb-4">
          Modifier le statut
        </h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-wood-700 mb-1">
            Statut de la table {table.numeroDeTable}
          </label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full p-2 border border-wood-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
          >
            <option value="libre">Libre</option>
            <option value="occupee">Occupée</option>
            <option value="reservee">Réservée</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-wood-600 text-white hover:bg-wood-700 transition"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTableModal;
