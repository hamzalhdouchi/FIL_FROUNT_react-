    import React from 'react';

    const TableReservationModal = ({ 
    showModal, 
    closeModal, 
    reservationForm, 
    handleReservationChange, 
    handleReservationSubmit,
    selectedDishes,
    removeDishFromSelection
    }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden modal-enter">
            <div className="bg-wood-700 text-white py-4 px-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif ">Réservation de Table</h3>
                <button onClick={closeModal} className="text-white hover:text-wood-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            </div>
            <form onSubmit={handleReservationSubmit} className="p-6">
            <div className="space-y-4">
                <div>
                <label htmlFor="name" className="block text-sm font-medium font-serif text-wood-800 mb-1">Nom complet</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={reservationForm.name}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" 
                />
                </div>
                
                <div>
                <label htmlFor="email" className="block text-sm font-medium font-serif text-wood-800 mb-1">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={reservationForm.email}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" 
                />
                </div>
                
                <div>
                <label htmlFor="phone" className="block text-sm font-medium font-serif text-wood-800 mb-1">Téléphone</label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={reservationForm.phone}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" 
                />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium font-serif text-wood-800 mb-1">Date</label>
                    <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={reservationForm.date}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" 
                    />
                </div>
                
                <div>
                    <label htmlFor="time" className="block text-sm font-medium font-serif text-wood-800 mb-1">Heure</label>
                    <input 
                    type="time" 
                    id="time" 
                    name="time" 
                    value={reservationForm.time}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" 
                    />
                </div>
                </div>
                
                <div>
                <label htmlFor="guests" className="block text-sm font-medium font-serif text-wood-800 mb-1">Nombre de personnes</label>
                <select 
                    id="guests" 
                    name="guests" 
                    value={reservationForm.guests}
                    onChange={handleReservationChange}
                    required 
                    className="w-full px-4 py-2 border font-serif border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                >
                    <option value="">Sélectionnez</option>
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4 personnes</option>
                    <option value="5">5 personnes</option>
                    <option value="6">6 personnes</option>
                    <option value="7">7 personnes</option>
                    <option value="8">8 personnes</option>
                    <option value="more">Plus de 8 personnes</option>
                </select>
                </div>
                
                <div>
                <label htmlFor="special-requests" className="block text-sm font-serif font-medium text-wood-800 mb-1">Demandes spéciales</label>
                <textarea 
                    id="special-requests" 
                    name="special_requests" 
                    rows="3" 
                    value={reservationForm.special_requests}
                    onChange={handleReservationChange}
                    className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                ></textarea>
                </div>
                
                <div className="pt-2">
               
                </div>
            </div>
            
            <div className="mt-6">
                <button type="submit" className="w-full font-serif py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg">
                Confirmer la réservation
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default TableReservationModal;