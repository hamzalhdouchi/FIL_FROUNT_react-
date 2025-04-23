import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddIngredientForm = () => {
  const [ingredients, setIngredients] = useState([
    { nom_ingredient: '', stock: '', unite_mesure: '', plat_id: '' }
  ]);
  const [plats, setPlats] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Charger la liste des plats
  useEffect(() => {
    axios.get('/api/plats')
      .then(response => {
        setPlats(response.data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des plats:', error);
        setErrorMessage('Erreur lors du chargement des plats');
      });
  }, []);

  // Gérer le changement d'un champ pour un ingrédient spécifique
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...ingredients];
    newIngredients[index][name] = name === 'stock' ? parseInt(value) || 0 : value;
    setIngredients(newIngredients);
  };

  // Ajouter un nouveau champ d'ingrédient
  const addIngredientField = () => {
    setIngredients([...ingredients, { nom_ingredient: '', stock: '', unite_mesure: '', plat_id: '' }]);
  };

  // Supprimer un champ d'ingrédient
  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  // Soumettre tous les ingrédients
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Filtrer les ingrédients valides (tous les champs remplis)
      const validIngredients = ingredients.filter(ing => 
        ing.nom_ingredient && ing.stock && ing.unite_mesure && ing.plat_id
      );

      if (validIngredients.length === 0) {
        setErrorMessage('Veuillez remplir au moins un ingrédient complet');
        return;
      }

      const response = await axios.post('/api/ingredients/mass', validIngredients);
      console.log('Ingrédients ajoutés avec succès:', response.data);
      
      setSuccessMessage(`${validIngredients.length} ingrédient(s) ajouté(s) avec succès`);
      setIngredients([{ nom_ingredient: '', stock: '', unite_mesure: '', plat_id: '' }]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout des ingrédients:', error);
      setErrorMessage('Erreur lors de l\'ajout des ingrédients');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Ajout d'Ingrédients en Masse</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Ingrédient #{index + 1}</h3>
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredientField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`nom_ingredient_${index}`} className="block text-gray-700">Nom:</label>
                <input
                  type="text"
                  id={`nom_ingredient_${index}`}
                  name="nom_ingredient"
                  value={ingredient.nom_ingredient}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor={`stock_${index}`} className="block text-gray-700">Stock:</label>
                <input
                  type="number"
                  id={`stock_${index}`}
                  name="stock"
                  value={ingredient.stock}
                  onChange={(e) => handleChange(index, e)}
                  required
                  min="0"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor={`unite_mesure_${index}`} className="block text-gray-700">Unité:</label>
                <input
                  type="text"
                  id={`unite_mesure_${index}`}
                  name="unite_mesure"
                  value={ingredient.unite_mesure}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor={`plat_id_${index}`} className="block text-gray-700">Plat:</label>
                <select
                  id={`plat_id_${index}`}
                  name="plat_id"
                  value={ingredient.plat_id}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un plat</option>
                  {plats.map((plat) => (
                    <option key={plat.id} value={plat.id}>
                      {plat.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={addIngredientField}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
          >
            + Ajouter un autre ingrédient
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Enregistrer tous les ingrédients'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIngredientForm;