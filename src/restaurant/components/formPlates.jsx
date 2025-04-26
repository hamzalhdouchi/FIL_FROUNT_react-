import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CreatePlatModal({ closeModal, selectedPlat, fetchPlats }) {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const menu = JSON.parse(sessionStorage.getItem('menu'));
  console.log(menu);
  
const menu_id = menu[0].id;
console.log(menu_id);


  const [form, setForm] = useState({
    nom_plat: selectedPlat ? selectedPlat.nom_plat : '',
    desciption: selectedPlat ? selectedPlat.desciption : '',
    prix: selectedPlat ? selectedPlat.prix : '',
    temps_Preparation: selectedPlat ? selectedPlat.temps_Preparation : '',
    image: null,
    categorie_id: selectedPlat ? selectedPlat.categorie_id : '',
    ingredients: selectedPlat ? selectedPlat.ingredients : [],
    menu_id: parseInt(menu_id),
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/categories/${menu_id}`).then(res => setCategories(res.data));
    axios.get('http://localhost:8000/api/ingredients').then(res => setIngredients(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else if (name === 'ingredients') {
      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
      setForm(prev => ({ ...prev, ingredients: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'ingredients') {
        value.forEach(id => formData.append('ingredients[]', id));
      } else {
        formData.append(key, value);
      }
    });

    setIsLoading(true);

    try {
      let response;
      if (selectedPlat) {
        response = await axios.post(`http://localhost:8000/api/plats/${selectedPlat.id}?_method=PUT`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:8000/api/plats', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      Swal.fire({
        title: "Succès",
        text: response.data.message || "Plat mis à jour avec succès.",
        icon: "success",
        timer: 900,
        showConfirmButton: false,
      });

      closeModal();
      fetchPlats();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      Swal.fire({
        title: "Erreur",
        text: error.response?.data?.message || "Une erreur est survenue.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="bg-wood-700 text-white py-4 px-6 sticky top-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif">{selectedPlat ? 'Modifier le plat' : 'Créer un plat'}</h3>
            <button onClick={closeModal} className="text-white hover:text-wood-200 transition-colors">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat *</label>
            <input
              type="text"
              name="nom_plat"
              value={form.nom_plat}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="desciption"
              value={form.desciption}
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
                value={form.prix}
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
                value={form.temps_Preparation}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select
              name="categorie_id"
              value={form.categorie_id}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500"
              required
            >
              <option value="">Choisir une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.mon_categorie}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients *</label>
            <select
              name="ingredients"
              multiple
              value={form.ingredients}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 h-32"
              required
            >
              {ingredients.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.nom_ingredient} ({ing.stock} {ing.unite_mesure})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs ingrédients</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-wood-700 hover:to-wood-800'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Chargement...
              </span>
            ) : (
              selectedPlat ? 'Modifier le plat' : 'Créer le plat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
