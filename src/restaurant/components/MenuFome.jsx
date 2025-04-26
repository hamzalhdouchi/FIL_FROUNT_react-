import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMenuModal = ({ closeModal, fetchMenus }) => {
  const [formData, setFormData] = useState({
    name_Menu: '',
    isActif: true,
    restaurant_id: '',
  });

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Erreur en récupérant les restaurants :', error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/menus', formData);
      fetchMenus(); // callback pour rafraîchir la liste
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création du menu :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden modal-enter">
        <div className="bg-wood-700 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif">Ajouter un Menu</h3>
            <button onClick={closeModal} className="text-white hover:text-wood-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name_Menu" className="block text-sm font-medium text-wood-800 mb-1">Nom du menu</label>
            <input
              type="text"
              id="name_Menu"
              name="name_Menu"
              value={formData.name_Menu}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActif"
              name="isActif"
              checked={formData.isActif}
              onChange={handleChange}
              className="w-5 h-5 text-wood-600 border-gray-300 rounded focus:ring-wood-500"
            />
            <label htmlFor="isActif" className="ml-2 block text-sm text-wood-800">Menu actif</label>
          </div>

          <div>
            <label htmlFor="restaurant_id" className="block text-sm font-medium text-wood-800 mb-1">Restaurant</label>
            <select
              id="restaurant_id"
              name="restaurant_id"
              value={formData.restaurant_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
            >
              <option value="">Sélectionnez un restaurant</option>
              {restaurants.map((resto) => (
                <option key={resto.id} value={resto.id}>{resto.nom}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg">
              Ajouter le Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuModal;
