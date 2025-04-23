import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CreatePlatModal = ({ closeModal, onDishCreated }) => {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    nom_plat: '',
    description: '',
    prix: '',
    temps_preparation: '',
    disponible: true,
    image: null,
    categorie_id: '',
    ingredients: []
  });

  // Chargement des données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, ingredientsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/ingredients')
        ]);
        setCategories(categoriesRes.data);
        setIngredients(ingredientsRes.data);
      } catch (err) {
        console.error("Erreur de chargement des données", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    setForm(prev => {
      if (type === 'file') {
        return { ...prev, [name]: files[0] };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      } else if (name === 'ingredients') {
        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
        return { ...prev, ingredients: selected };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }, []);

  const validateForm = useCallback(() => {
    if (!form.nom_plat.trim()) {
      setError("Le nom du plat est requis");
      return false;
    }
    if (!form.prix || isNaN(form.prix) ){
      setError("Le prix doit être un nombre valide");
      return false;
    }
    if (!form.temps_preparation || isNaN(form.temps_preparation)) {
      setError("Le temps de préparation doit être un nombre valide");
      return false;
    }
    if (!form.categorie_id) {
      setError("Veuillez sélectionner une catégorie");
      return false;
    }
    if (form.ingredients.length === 0) {
      setError("Veuillez sélectionner au moins un ingrédient");
      return false;
    }
    if (!form.image) {
      setError("Une image est requise");
      return false;
    }
    return true;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('nom_plat', form.nom_plat);
    formData.append('description', form.description);
    formData.append('prix', form.prix);
    formData.append('temps_preparation', form.temps_preparation);
    formData.append('disponible', form.disponible);
    formData.append('categorie_id', form.categorie_id);
    formData.append('image', form.image);
    form.ingredients.forEach(id => formData.append('ingredients[]', id));

    try {
      setIsLoading(true);
      const response = await axios.post('/api/plats', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onDishCreated(response.data);
      closeModal();
    } catch (err) {
      console.error("Erreur lors de la création du plat", err);
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }, [form, validateForm, closeModal, onDishCreated]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="bg-wood-700 text-white py-4 px-6 sticky top-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-playfair">Ajouter un nouveau plat</h3>
            <button 
              onClick={closeModal} 
              className="text-white hover:text-wood-200 transition-colors"
              disabled={isLoading}
            >
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
              name="description"
              value={form.description}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Temps préparation (min) *</label>
              <input
                type="number"
                name="temps_preparation"
                value={form.temps_preparation}
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
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              name="disponible"
              checked={form.disponible}
              onChange={handleChange}
              disabled={isLoading}
              className="h-4 w-4 text-wood-600 focus:ring-wood-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Disponible immédiatement</label>
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                En cours...
              </span>
            ) : (
              'Créer le plat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlatModal;