import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateReservationStatusModal = ({ reservation, closeModal, fetchReservations }) => {
  const [status, setStatus] = useState(reservation.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/reservations/${reservation.id}/status`, { status });
      Swal.fire("Succès", "Statut mis à jour avec succès", "success");
      fetchReservations(); 
      closeModal(); 
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Une erreur est survenue", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-wood-700">Modifier le statut</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-wood-300 rounded-md mb-4"
        >
          <option value="En attente de confirmation">En attente de confirmation</option>
          <option value="Confirmée">Confirmée</option>
          <option value="Annulée">Annulée</option>
          <option value="Terminée">Terminée</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-wood-600 text-white rounded-md hover:bg-wood-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateReservationStatusModal;
