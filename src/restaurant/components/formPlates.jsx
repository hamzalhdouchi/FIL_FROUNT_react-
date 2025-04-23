import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CreatePlatModal({ closeModal, handleSubmitDish }) {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [form, setForm] = useState({
    nom_plat: '',
    description: '',
    prix: '',
    temps_Preparation: '',
    image: null,
    categorie_id: '',
    ingredients: [],
    disponible: false,
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories').then(res => setCategories(res.data));
    axios.get('http://localhost:8000/api/ingredients').then(res => setIngredients(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'image') {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
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
        value.forEach((id) => formData.append('ingredients[]', id));
      } else {
        formData.append(key, value);
      }
    });
    console.log(formData);
    
    try {
      const response = await axios.post('http://localhost:8000/api/plats', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // handleSubmitDish(formData);
      // closeModal();
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden modal-enter">
        <div className="bg-wood-700 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-playfair">Ajouter un plat</h3>
            <button onClick={closeModal} className="text-white hover:text-wood-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="text" name="nom_plat" placeholder="Nom du plat" value={form.nom_plat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="number" name="prix" placeholder="Prix" value={form.prix} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="number" name="temps_Preparation" placeholder="Temps de préparation (min)" value={form.temps_Preparation} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />

          <select name="categorie_id" value={form.categorie_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Choisir une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>

          <select name="ingredients" multiple value={form.ingredients} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg h-32" required>
            {ingredients.map(ing => (
              <option key={ing.id} value={ing.id}>{ing.nom_ingredient}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} />
            <label>Disponible</label>
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white rounded-lg">
            Ajouter le plat
          </button>
        </form>
      </div>
    </div>
  );
}
