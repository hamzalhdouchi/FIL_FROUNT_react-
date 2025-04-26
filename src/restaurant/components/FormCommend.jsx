import React from 'react';

const OrderModal = ({ 
  showModal, 
  closeModal, 
  currentplate, 
  plateModalState, 
  handleplateModalChange, 
  handleQuantityChange,
  addplateToSelection
}) => {
  if (!showModal || !currentplate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden modal-enter">
        <div className="bg-wood-700 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif ">Réserver un Plat</h3>
            <button onClick={closeModal} className="text-white hover:text-wood-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-xl font-serif  mb-2">{currentplate.nom_plat}</h4>
            <p className="text-wood-600 mb-1">{currentplate.category}</p>
            <p className="text-lg font-semibold text-wood-700">{currentplate.prix}€</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="plateQuantity" className="block text-sm font-medium text-wood-800 mb-2">Quantité</label>
            <div className="flex items-center">
              <button 
                type="button" 
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full bg-wood-100 text-wood-700 flex items-center justify-center hover:bg-wood-200 transition-colors"
              >
                -
              </button>
              <input 
                type="number" 
                id="plateQuantity" 
                name="quantity" 
                value={plateModalState.quantity}
                onChange={handleplateModalChange}
                min="1" 
                max="10" 
                className="w-12 text-center mx-2 border border-wood-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-wood-500"
              />
              <button 
                type="button" 
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full bg-wood-100 text-wood-700 flex items-center justify-center hover:bg-wood-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="plateNotes" className="block text-sm font-medium text-wood-800 mb-2">Notes spéciales</label>
            <textarea 
              id="plateNotes" 
              name="notes" 
              value={plateModalState.notes}
              onChange={handleplateModalChange}
              rows="2" 
              placeholder="Ex: serif gluten, serif lactose, etc." 
              className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div className="flex space-x-4">
            <button 
              type="button"
              onClick={addplateToSelection}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg"
            >
              Ajouter à ma commande
            </button>
            <button 
              type="button"
              onClick={closeModal}
              className="py-3 px-4 border border-wood-300 text-wood-700 font-medium rounded-lg hover:bg-wood-50 transition-colors"
            >
              Annuler       
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;