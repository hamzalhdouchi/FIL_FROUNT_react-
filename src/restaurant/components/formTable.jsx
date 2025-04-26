import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const TABLE_STATUSES = [
  { value: 'libre', label: 'Libre' },
  { value: 'occupee', label: 'Occupée' },
  { value: 'reservee', label: 'Réservée' },
];

const TableModal = ({ 
  restaurantId, 
  closeModal, 
  fetchTables,
  initialData = null, 
  isEditMode = false 
}) => {
  const [formState, setFormState] = useState({
    numeroDeTable: initialData?.numeroDeTable || '',
    capacite: initialData?.capacite || 2,
    statut: initialData?.statut || 'libre',
    isLoading: false,
    error: null,
    touched: {}
  });

  // Clear errors when form changes
  useEffect(() => {
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  }, [formState.numeroDeTable, formState.capacite, formState.statut]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      touched: { ...prev.touched, [name]: true }
    }));
  }, []);

  const validateField = (field, value) => {
    if (!value && field !== 'qrCode') return 'Ce champ est requis';
    if (field === 'numeroDeTable' && !/^\d+$/.test(value)) return 'Doit être un nombre';
    if (field === 'capacite' && (!Number.isInteger(Number(value)) || value < 1) ){
      return 'Doit être un nombre entier positif';
    }
    return null;
  };

  const validateForm = useCallback(() => {
    const errors = [];
    const newTouched = { ...formState.touched };

    ['numeroDeTable', 'capacite', 'statut'].forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formState[field]);
      if (error) errors.push(`${field === 'numeroDeTable' ? 'Numéro de table' : 
                            field === 'capacite' ? 'Capacité' : 'Statut'}: ${error}`);
    });

    setFormState(prev => ({ ...prev, touched: newTouched }));
    return errors.length === 0 ? true : errors.join('\n');
  }, [formState.numeroDeTable, formState.capacite, formState.statut]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationResult = validateForm();
    if (validationResult !== true) {
      setFormState(prev => ({ ...prev, error: validationResult }));
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const restaurant = JSON.parse(sessionStorage.getItem('restaurant'));
        console.log(restaurant);
        
      const restaurant_id = restaurant.id;
      const tableData = {
        numeroDeTable: formState.numeroDeTable,
        capacite: Number(formState.capacite),
        statut: formState.statut,
        restaurant_id: restaurant_id
      };
        const response = isEditMode 
        ? await axios.put(`http://localhost:8000/api/restaurants/${restaurant_id}/tables`, {
            ...tableData,
            idTable: initialData.id
          })
        : await axios.post(`http://localhost:8000/api/restaurants/${restaurant_id}/tables`, tableData);

      await Swal.fire({
        title: "Succès!",
        text: response.data.message || 
             (isEditMode ? "Table mise à jour" : "Table créée") + " avec succès",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      fetchTables();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join('\n') || 
                          `Erreur lors de ${isEditMode ? 'la mise à jour' : 'la création'} de la table`;

      setFormState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState, restaurantId, isEditMode, initialData, validateForm, closeModal, fetchTables]);

  const hasError = (field) => {
    return formState.touched[field] && validateField(field, formState[field]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-wood-700 text-white py-4 px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {isEditMode ? 'Modifier la Table' : 'Ajouter une Table'}
            </h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          {/* Numéro de Table */}
          <div>
            <label htmlFor="numeroDeTable" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de Table *
            </label>
            <input
              type="number"
              id="numeroDeTable"
              name="numeroDeTable"
              value={formState.numeroDeTable}
              onChange={handleChange}
              disabled={formState.isLoading || isEditMode}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                hasError('numeroDeTable') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100`}
              aria-invalid={!!hasError('numeroDeTable')}
              aria-describedby={hasError('numeroDeTable') ? 'error-numeroDeTable' : undefined}
            />

            {hasError('numeroDeTable') && (
              <p id="error-numeroDeTable" className="mt-1 text-sm text-red-600">
                {hasError('numeroDeTable')}
              </p>
            )}
          </div>

          {/* Capacité */}
          <div>
            <label htmlFor="capacite" className="block text-sm font-medium text-gray-700 mb-1">
              Capacité (personnes) *
            </label>
            <input
              type="number"
              id="capacite"
              name="capacite"
              min="1"
              value={formState.capacite}
              onChange={handleChange}
              disabled={formState.isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                hasError('capacite') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100`}
              aria-invalid={!!hasError('capacite')}
              aria-describedby={hasError('capacite') ? 'error-capacite' : undefined}
            />
            {hasError('capacite') && (
              <p id="error-capacite" className="mt-1 text-sm text-red-600">
                {hasError('capacite')}
              </p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
              Statut *
            </label>
            <select
              id="statut"
              name="statut"
              value={formState.statut}
              onChange={handleChange}
              disabled={formState.isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-wood-500 focus:border-wood-500 ${
                hasError('statut') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100`}
              aria-invalid={!!hasError('statut')}
              aria-describedby={hasError('statut') ? 'error-statut' : undefined}
            >
              {TABLE_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {hasError('statut') && (
              <p id="error-statut" className="mt-1 text-sm text-red-600">
                {hasError('statut')}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={formState.isLoading}
              className={`w-full py-3 px-4 bg-wood-600 hover:bg-wood-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center`}
            >
              {formState.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                isEditMode ? 'Mettre à jour la Table' : 'Créer la Table'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// TableModal.propTypes = {
//   restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   closeModal: PropTypes.func.isRequired,
//   fetchTables: PropTypes.func.isRequired,
//   initialData: PropTypes.object,
//   isEditMode: PropTypes.bool
// };

export default TableModal;