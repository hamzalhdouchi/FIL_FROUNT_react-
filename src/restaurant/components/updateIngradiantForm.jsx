    import React, { useState, useEffect } from "react";
    import axios from "axios";

    const EditIngredientModal = ({ isOpen, onClose, ingredient, onIngredientUpdated }) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ingredient) {
        setName(ingredient.nom_ingredient || "");
        setQuantity(ingredient.stock || "");
        }
    }, [ingredient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        

        try {
        const response = await axios.put(`http://localhost:8000/ingredients/${ingredient.id}`, {
            nom_ingredient: name,
            stock: quantity,
            unite_mesure: unit,
        });
        onIngredientUpdated(response.data);
        onClose();
        } catch (err) {
        console.log(err);
        setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
        setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modifier l'ingrédient</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Quantité</label>
                <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
                required
                />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Unité</label>
            <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-wood-500"
                required
            >
                <option value="">-- Sélectionner une unité --</option>
                <option value="kg">Kilogrammes (kg)</option>
                <option value="g">Grammes (g)</option>
                <option value="l">Litres (l)</option>
                <option value="ml">Millilitres (ml)</option>
                <option value="pièce">Pièce</option>
            </select>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                Annuler
                </button>
                <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-wood-600 text-white rounded-md hover:bg-wood-700 disabled:opacity-50"
                >
                {loading ? "Modification..." : "Modifier"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default EditIngredientModal;
