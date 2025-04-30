import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditPlatModal = ({ open, onClose, plat, onUpdate, idPlate, ingredients }) => {
  const [formData, setFormData] = useState({
    nom_plat: '',
    desciption: '',
    prix: '',
    image: null,
    temps_Preparation: '',
    categorie_id: '',
    ingredients: [],
  });
  console.log('fjdkvdvjfjkjvdfjkjkdjgjfk',plat);
  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    if (plat) {
      setFormData({
        nom_plat: plat.nom_plat || '',
        desciption: plat.desciption || '',
        prix: plat.prix || '',
        image: null,
        temps_Preparation: plat.temps_Preparation || '',
        categorie_id: plat.categorie_id || '',
        ingredients: plat.ingredients || [],
      });
    }
  }, [plat]);

  const handleChange = (e) => {
    const { name, value, files, selectedOptions } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.nom_plat || !formData.prix || !formData.temps_Preparation || !formData.categorie_id) {
      setError('Tous les champs obligatoires doivent être remplis.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log(formData);
      
      const data = new FormData();
      data.append('nom_plat_plat', formData.nom_plat);
      data.append('desciption', formData.desciption);
      data.append('prix', formData.prix);
      data.append('temps_Preparation', formData.temps_Preparation);

      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post(`http://localhost:8000/api/plats/${plat.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Plat modifié avec succès',
        showConfirmButton: false,
        timer: 2000,
      });

      onUpdate();
      onClose();
      setTimeout(() => {
        window.location.reload();
      },3000)
    } catch (error) {
      console.error('Erreur lors de la modification du plat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la modification du plat.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formData);
  

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 overflow-y-auto max-h-[90vh]">
          <div className="bg-wood-700 text-white py-4 px-6 sticky top-0">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">{plat ? 'Modifier le plat' : 'Créer un plat'}</h3>
              <button onClick={onClose} className="text-white hover:text-wood-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">nom du plat *</label>
              <input
                type="text"
                name="nom_plat"
                value={formData.nom_plat}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">desciption</label>
              <textarea
                name="desciption"
                value={formData.desciption}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps de préparation (min) *</label>
                <input
                  type="number"
                  name="temps_Preparation"
                  value={formData.temps_Preparation}
                  onChange={handleChange}
                  disabled={isLoading}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-wood-700 hover:to-wood-800'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Chargement...
                </span>
              ) : (
                plat ? 'Modifier le plat' : 'Créer le plat'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default EditPlatModal;
