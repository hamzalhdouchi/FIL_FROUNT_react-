import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateCategoryModal = ({ closeModal, category, fetchdata }) => {
  const [formData, setFormData] = useState({
    mon_categorie: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        mon_categorie: category.mon_categorie || '',
        description: category.description || '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.mon_categorie.trim()) {
      setError('Le nom de la catégorie est obligatoire');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (!validateForm()) return;
    console.log('formData', formData);
    
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:8000/api/categories/${category.id}`, formData);

      Swal.fire({
        icon: "success",
        title: "Catégorie mise à jour avec succès",
        text: "Les modifications ont bien été enregistrées.",
        timer: 2000,
        showConfirmButton: false,
      });

    closeModal();
    fetchdata();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden modal-enter">
        <div className="bg-wood-700 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif">Modifier la Catégorie</h3>
            <button onClick={closeModal} className="text-white hover:text-wood-200" disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="mon_categorie" className="block text-sm font-medium text-wood-800 mb-1">
              Nom de la catégorie *
            </label>
            <input
              type="text"
              id="mon_categorie"
              name="mon_categorie"
              value={formData.mon_categorie}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-wood-800 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
              disabled={isLoading}
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-wood-700 hover:to-wood-800'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'En cours...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryModal;
