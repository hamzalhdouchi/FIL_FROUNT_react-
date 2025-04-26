import React, { useState, useCallback } from 'react';
import axios from 'axios';

const AddIngredientsModal = ({ closeModal, handleSubmitIngredients }) => {
  const [ingredients, setIngredients] = useState([
    { nom_ingredient: '', stock: '', unite_mesure: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setIngredients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  }, []);

  const addIngredientField = useCallback(() => {
    setIngredients(prev => [...prev, { nom_ingredient: '', stock: '', unite_mesure: '' }]);
  }, []);

  const removeIngredientField = useCallback((index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validateIngredients = useCallback(() => {
    for (const [i, ing] of ingredients.entries()) {
      if (!ing.nom_ingredient.trim()) {
        setError(`Le nom de l'ingrédient #${i + 1} est requis`);
        return false;
      }
      if (isNaN(ing.stock) ){
        setError(`Le stock de l'ingrédient #${i + 1} doit être un nombre`);
        return false;
      }
      if (!ing.unite_mesure.trim()) {
        setError(`L'unité de mesure de l'ingrédient #${i + 1} est requise`);
        return false;
      }
    }
    return true;
  }, [ingredients]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateIngredients()) return;

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/api/ingredients', {ingredients});
      
      if (response.status === 201) {
        setSuccess(true);
        handleSubmitIngredients(ingredients);
        setTimeout(closeModal, 1000); 
      }
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, validateIngredients, handleSubmitIngredients, closeModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden modal-enter">
        <div className="bg-wood-700 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif">Ajouter des Ingrédients</h3>
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

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {/* Messages d'état */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Ingrédients enregistrés avec succès !
            </div>
          )}

          {/* Liste des ingrédients */}
          {ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end border-b border-gray-200 pb-4 mb-4">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-wood-800 mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom_ingredient"
                  value={ingredient.nom_ingredient}
                  onChange={(e) => handleChange(index, e)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm font-medium text-wood-800 mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="0.01"
                  value={ingredient.stock}
                  onChange={(e) => handleChange(index, e)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm font-medium text-wood-800 mb-1">Unité *</label>
                <select
                  name="unite_mesure"
                  value={ingredient.unite_mesure}
                  onChange={(e) => handleChange(index, e)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="">Sélectionner</option>
                  <option value="g">Grammes (g)</option>
                  <option value="kg">Kilogrammes (kg)</option>
                  <option value="ml">Millilitres (ml)</option>
                  <option value="L">Litres (L)</option>
                  <option value="unité">Unité</option>
                </select>
              </div>
              
              <div className="col-span-2 flex justify-end">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    disabled={isLoading}
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addIngredientField}
              disabled={isLoading}
              className="text-sm font-medium text-wood-700 hover:text-wood-900 disabled:text-gray-400 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un ingrédient
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-wood-700 hover:to-wood-800'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                'Enregistrer les ingrédients'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIngredientsModal;