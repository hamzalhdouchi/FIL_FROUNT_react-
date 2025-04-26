import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const UNITS = [
  { value: 'g', label: 'Grammes (g)' },
  { value: 'kg', label: 'Kilogrammes (kg)' },
  { value: 'ml', label: 'Millilitres (ml)' },
  { value: 'L', label: 'Litres (L)' },
  { value: 'unité', label: 'Unité' },
];

const AddIngredientsModal = ({ closeModal, fetchdata }) => {
  const [formState, setFormState] = useState({
    ingredients: [{ nom_ingredient: '', stock: '', unite_mesure: '' }],
    isLoading: false,
    error: null,
    touched: {}
  });

  // Effet pour nettoyer les erreurs quand les champs sont modifiés
  useEffect(() => {
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  }, [formState.ingredients]);

  const handleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormState(prev => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
      
      return {
        ...prev,
        ingredients: updatedIngredients,
        touched: { ...prev.touched, [`${name}-${index}`]: true }
      };
    });
  }, []);

  const addIngredientField = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { nom_ingredient: '', stock: '', unite_mesure: '' }]
    }));
  }, []);

  const removeIngredientField = useCallback((index) => {
    setFormState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  }, []);

  const validateField = (field, value, index) => {
    if (!value.trim()) return 'Ce champ est requis';
    if (field === 'stock' && isNaN(value)) return 'Doit être un nombre valide';
    if (field === 'stock' && parseFloat(value) < 0) return 'Doit être positif';
    return null;
  };

  const validateForm = useCallback(() => {
    const errors = [];
    const newTouched = {};

    formState.ingredients.forEach((ing, index) => {
      ['nom_ingredient', 'stock', 'unite_mesure'].forEach(field => {
        newTouched[`${field}-${index}`] = true;
        const error = validateField(field, ing[field], index);
        if (error) errors.push(`Ingrédient #${index + 1}: ${error}`);
      });
    });

    setFormState(prev => ({ ...prev, touched: newTouched }));
    return errors.length === 0 ? true : errors.join('\n');
  }, [formState.ingredients]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationResult = validateForm();
    if (validationResult !== true) {
      setFormState(prev => ({ ...prev, error: validationResult }));
      return;
    }
  
    console.log({ formState });
  
    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axios.post('http://localhost:8000/api/ingredients', 
        { ingredients: formState.ingredients },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.status === 201) {
        await Swal.fire({
          title: "Succès!",
          text: response.data.message || "Ingrédients ajoutés avec succès",
          icon: "success",
          confirmButtonText: "OK",
        });
  
        closeModal();
        fetchdata();
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || 
      error.response?.data?.errors?.join('\n') || 
      "Erreur lors de l'enregistrement";
  
      await Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
  
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState.ingredients, validateForm, closeModal]);

  const hasError = (field, index) => {
    const isTouched = formState.touched[`${field}-${index}`];
    const value = formState.ingredients[index][field];
    return isTouched && validateField(field, value, index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="bg-wood-700 text-white py-4 px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-serif">Ajouter des Ingrédients</h2>
            <button 
              onClick={closeModal} 
              className="text-white hover:text-wood-200 transition-colors focus:outline-none"
              disabled={formState.isLoading}
              aria-label="Fermer la modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {formState.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 whitespace-pre-line">{formState.error}</p>
                </div>
              </div>
            </div>
          )}

          {formState.ingredients.map((ingredient, index) => (
            <fieldset key={index} className="grid grid-cols-12 gap-4 items-end border-b border-gray-200 pb-4 mb-4 last:border-0">
              <div className="col-span-4">
                <label htmlFor={`nom_ingredient-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  id={`nom_ingredient-${index}`}
                  name="nom_ingredient"
                  value={ingredient.nom_ingredient}
                  onChange={(e) => handleChange(index, e)}
                  disabled={formState.isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                    hasError('nom_ingredient', index) ? 'border-red-500' : 'border-gray-300'
                  } disabled:bg-gray-100`}
                  aria-invalid={!!hasError('nom_ingredient', index)}
                  aria-describedby={hasError('nom_ingredient', index) ? `error-nom_ingredient-${index}` : undefined}
                />
                {hasError('nom_ingredient', index) && (
                  <p id={`error-nom_ingredient-${index}`} className="mt-1 text-sm text-red-600">
                    {hasError('nom_ingredient', index)}
                  </p>
                )}
              </div>
              
              <div className="col-span-3">
                <label htmlFor={`stock-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  id={`stock-${index}`}
                  name="stock"
                  min="0"
                  step="0.01"
                  value={ingredient.stock}
                  onChange={(e) => handleChange(index, e)}
                  disabled={formState.isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                    hasError('stock', index) ? 'border-red-500' : 'border-gray-300'
                  } disabled:bg-gray-100`}
                  aria-invalid={!!hasError('stock', index)}
                  aria-describedby={hasError('stock', index) ? `error-stock-${index}` : undefined}
                />
                {hasError('stock', index) && (
                  <p id={`error-stock-${index}`} className="mt-1 text-sm text-red-600">
                    {hasError('stock', index)}
                  </p>
                )}
              </div>
              
              <div className="col-span-3">
                <label htmlFor={`unite_mesure-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Unité *
                </label>
                <select
                  id={`unite_mesure-${index}`}
                  name="unite_mesure"
                  value={ingredient.unite_mesure}
                  onChange={(e) => handleChange(index, e)}
                  disabled={formState.isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                    hasError('unite_mesure', index) ? 'border-red-500' : 'border-gray-300'
                  } disabled:bg-gray-100`}
                  aria-invalid={!!hasError('unite_mesure', index)}
                  aria-describedby={hasError('unite_mesure', index) ? `error-unite_mesure-${index}` : undefined}
                >
                  <option value="">Sélectionner</option>
                  {UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                {hasError('unite_mesure', index) && (
                  <p id={`error-unite_mesure-${index}`} className="mt-1 text-sm text-red-600">
                    {hasError('unite_mesure', index)}
                  </p>
                )}
              </div>
              
              <div className="col-span-2 flex justify-end">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400 focus:outline-none"
                    disabled={formState.isLoading}
                    title="Supprimer cet ingrédient"
                    aria-label={`Supprimer l'ingrédient ${index + 1}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </fieldset>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={addIngredientField}
              disabled={formState.isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-wood-700 bg-wood-100 hover:bg-wood-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un ingrédient
            </button>
            
            <span className="text-sm text-gray-500">
              {formState.ingredients.length} ingrédient(s)
            </span>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={formState.isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-wood-600 hover:bg-wood-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 transition-colors ${
                formState.isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {formState.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement en cours...
                </>
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