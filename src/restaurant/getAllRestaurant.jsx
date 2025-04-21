import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import Pagination from './components/Pagination';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem('token');
  if (!token) {
    console.log("Token manquant");
  }
 
  const fetchData = async (url = 'http://127.0.0.1:8000/api/restaurants') => {
    setLoading(true);
    setError(null);
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(url);
      const restaurantAll = response.data.original.data.data;

      setRestaurants(restaurantAll);
      sessionStorage.setItem('restaurant', JSON.stringify(restaurantAll));
      setLinks(response.data.original.data.links);
    } catch (error) {
      setError("Erreur lors de la récupération des restaurants.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = async (restaurantId, action) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

      let url = '';
      if (action === 'accept') {
        url = `http://127.0.0.1:8000/api/restaurants/${restaurantId}/accept`;
      } else if (action === 'reject') {
        url = `http://127.0.0.1:8000/api/restaurants/${restaurantId}/reject`;
      }

      const response = await axios.put(url, {
        restaurant_id: restaurantId,
        action: action,
      });

      Swal.fire({
        title: "Succès!",
        text: response.data.message || "Action réussie.",
        icon: "success",
        confirmButtonText: "OK",
      });

      await fetchData(); 
    } catch (error) {
      console.error('Erreur lors de l’action:', error);
      Swal.fire({
        icon: "error",
        title: "Échec de l'action",
        text: error.response?.data?.message || "Une erreur s'est produite.",
      });
    }
  };

  const handleButtonDelete = async (restaurantId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/restaurants/${restaurantId}`);
      Swal.fire({
        title: "Succès!",
        text: "Restaurant supprimé avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
      await fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Swal.fire({
        icon: "error",
        title: "Erreur de suppression",
        text: error.response?.data?.message || "Impossible de supprimer ce restaurant.",
      });
    }
  };

  return (
    <section id="restaurants" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-wood-800">Restaurant Management</h3>
        <button className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center">
          <i className='bx bx-plus mr-2'></i> Add New Restaurant
        </button>
      </div>

      {loading && <p className="text-wood-600 p-4">Chargement des données...</p>}
      {error && <p className="text-red-600 p-4">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
              <div className="h-40 bg-wood-600 relative">
                <img 
                  src={`http://127.0.0.1:8000/api/storage/${restaurant.image}`} 
                  alt={restaurant.nom_Restaurant} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 ${restaurant.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'} text-white text-xs rounded-full`}>
                    {restaurant.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-wood-800 text-lg mb-1">{restaurant.nom_Restaurant}</h4>
                <p className="text-wood-600 text-sm mb-3">{restaurant.cuisine} • {restaurant.price_range}</p>
                <div className="flex items-center text-sm mb-3">
                  <i className='bx bxs-map text-wood-500 mr-1'></i>
                  <span className="text-wood-600">{restaurant.adresse}</span>
                </div>
                <div className="flex items-center text-sm mb-3">
                  <i className='bx bxs-phone text-wood-500 mr-1'></i>
                  <span className="text-wood-600">{restaurant.telephone}</span>
                </div>
                <div className="flex justify-between mt-4">
                  {(restaurant.status === 'En Attent' || restaurant.status === 'rejected') && (
                    <button onClick={() => handleButtonClick(restaurant.id, 'accept')} className="text-green-600 hover:text-green-800">
                      <i className='bx bx-check'></i> Accept
                    </button>
                  )}
                  {restaurant.status === 'accepted' && (
                    <button onClick={() => handleButtonClick(restaurant.id, 'reject')} className="text-yellow-600 hover:text-yellow-800">
                      <i className='bx bx-x'></i> Refuse
                    </button>
                  )}
                  <button className="text-wood-600 hover:text-wood-800">
                    <i className='bx bx-show'></i> View
                  </button>
                  <button onClick={() => handleButtonDelete(restaurant.id)} className="text-red-600 hover:text-red-800">
                    <i className='bx bx-trash'></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination links={links} onPageChange={fetchData} />
    </section>
  );
}

export default RestaurantManagement;
