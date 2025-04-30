import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Register = ({ isLoading, setIsLoading }) => {
  const [selectedRole, setSelectedRole] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    telephone: "",
    nom_utilisateur: "",
    prenom: "",
    nom_Restaurant: "",
    adresse: "",
    vehicule: "",
    zone: "",
    role_id: "1",
    image: null,
    name_Menu: '',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }

      let response;
      if (selectedRole === "user") {
        console.log(formData);
        
        response = await axios.post("http://localhost:8000/api/register", formData, {
            
            headers: {
                "Content-Type": "application/json",
              },
        });

        
      } else if (selectedRole === "restaurant") {
        console.log(formData.adresse, formData.nom_Restaurant, formData.zone_Livraison, formData.name_Menu);
                response = await axios.post("http://localhost:8000/api/restaurants", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (selectedRole === "livreur") {
        response = await axios.post("http://localhost:8000/api/register", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      Swal.fire({
        title: "Succès!",
        text: response.data.message || "Compte créé avec succès.",
        icon: "success",
        timer: 1000,
      });


      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Erreur!",
        text: err.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role_id: role === "user" ? "1" : role === "restaurant" ? "2" : "3"
    }));
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium font-serif text-wood-800">Je m'inscris en tant que</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => selectRole("user")}
            className={`py-3 px-2 border border-wood-200 rounded-lg font-medium hover:bg-wood-50 transition-colors shadow-sm flex flex-col items-center justify-center ${
              selectedRole === "user" ? "bg-wood-600 text-white" : "text-wood-700"
            }`}
          >
            <i className="bx bx-user text-xl mb-1"></i>
            <span className="font-serif text-xs">Utilisateur</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole("restaurant")}
            className={`py-3 px-2 border border-wood-200 rounded-lg font-medium hover:bg-wood-50 transition-colors shadow-sm flex flex-col items-center justify-center ${
              selectedRole === "restaurant" ? "bg-wood-600 text-white" : "text-wood-700"
            }`}
          >
            <i className="bx bx-restaurant text-xl mb-1"></i>
            <span className="font-serif text-xs">Restaurant</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole("livreur")}
            className={`py-3 px-2 border border-wood-200 rounded-lg font-medium hover:bg-wood-50 transition-colors shadow-sm flex flex-col items-center justify-center ${
              selectedRole === "livreur" ? "bg-wood-600 text-white" : "text-wood-700"
            }`}
          >
            <i className="bx bx-cycling text-xl mb-1"></i>
            <span className="font-serif text-xs">Livreur</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="signup-email" className="block text-sm font-serif font-medium text-wood-800">Email</label>
          <div className="relative">
            <i className="bx bx-envelope absolute left-3 top-3 text-wood-400"></i>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signup-password" className="block text-sm font-serif font-medium text-wood-800">Mot de passe</label>
          <div className="relative">
            <i className="bx bx-lock-alt absolute left-3 top-3 text-wood-400"></i>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signup-telephone" className="block text-sm font-serif font-medium text-wood-800">Téléphone</label>
          <div className="relative">
            <i className="bx bx-phone absolute left-3 top-3 text-wood-400"></i>
            <input
              id="signup-telephone"
              name="telephone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={formData.telephone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="signup-nom" className="block text-sm font-serif font-medium text-wood-800">Nom</label>
              <div className="relative">
                <i className="bx bx-user absolute left-3 top-3 text-wood-400"></i>
                <input
                  id="signup-nom"
                  name="nom_utilisateur"
                  type="text"
                  placeholder="Dupont"
                  required
                  value={formData.nom_utilisateur}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="signup-prenom" className="block text-sm font-serif font-medium text-wood-800">Prénom</label>
              <div className="relative">
                <i className="bx bx-user absolute left-3 top-3 text-wood-400"></i>
                <input
                  id="signup-prenom"
                  name="prenom"
                  type="text"
                  placeholder="Jean"
                  required
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
    

        {selectedRole === "restaurant" && (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="signup-restaurant-name" className="block text-sm font-serif font-medium text-wood-800">Nom du Restaurant</label>
        <div className="relative">
          <i className="bx bx-store absolute left-3 top-3 text-wood-400"></i>
          <input
            id="signup-restaurant-name"
            name="nom_Restaurant"
            type="text"
            placeholder="Le Gourmet"
            required
            value={formData.nom_Restaurant}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-restaurant-address" className="block text-sm font-serif font-medium text-wood-800">Adresse</label>
        <div className="relative">
          <i className="bx bx-map absolute left-3 top-3 text-wood-400"></i>
          <input
            id="signup-restaurant-address"
            name="adresse"
            type="text"
            placeholder="123 Rue de la Gastronomie, 75001 Paris"
            required
            value={formData.adresse}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Zone de Livraison Field */}
      <div className="space-y-2">
        <label htmlFor="signup-restaurant-zone" className="block text-sm font-medium font-serif text-wood-800">Zone de Livraison</label>
        <div className="relative">
          <i className="bx bx-map-alt absolute left-3 top-3 text-wood-400"></i>
          <input
            id="signup-restaurant-zone"
            name="zone_Livraison"
            type="text"
            placeholder="Zone de livraison (ex. Paris 1er, 2ème)"
            required
            value={formData.zone_Livraison}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
          />
        </div>
      </div>

 

      <div className="space-y-2">
        <label htmlFor="signup-restaurant-director" className="block text-sm font-medium font-serif text-wood-800">Nom du Menu</label>
        <div className="relative">
        <i className="bx bx-book-open absolute left-3 top-3 text-wood-400"></i> 
        <input
            id="signup-restaurant-director"
            name="name_Menu"
            type="text"
            placeholder="Menu Gourmet"
            required
            value={formData.name_Menu}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Image Upload Field */}
      <div className="space-y-2">
        <label htmlFor="restaurant-image" className="block text-sm font-medium text-wood-800">
          Logo/Photo du restaurant
        </label>
        <div className="relative">
          <i className="bx bx-image absolute left-3 top-3 text-wood-400"></i>
          <input
            id="restaurant-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-wood-50 file:text-wood-700 hover:file:bg-wood-100"
          />
        </div>
        {formData.image && (
          <div className="mt-2 flex items-center space-x-4">
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Preview" 
              className="h-16 w-16 object-cover rounded border border-wood-200"
            />
            <span className="text-sm text-wood-600">
              {formData.image.name}
            </span>
          </div>
        )}
      </div>
    </div>
  )}

      {selectedRole === "livreur" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="signup-livreur-nom" className="block text-sm font-serif font-medium text-wood-800">Nom</label>
              <div className="relative">
                <i className="bx bx-user absolute left-3 top-3 text-wood-400"></i>
                <input
                  id="signup-livreur-nom"
                  name="nom_utilisateur"
                  type="text"
                  placeholder="Dupont"
                  required
                  value={formData.nom_utilisateur}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="signup-livreur-prenom" className="block text-sm font-serif font-medium text-wood-800">Prénom</label>
              <div className="relative">
                <i className="bx bx-user absolute left-3 top-3 text-wood-400"></i>
                <input
                  id="signup-livreur-prenom"
                  name="prenom"
                  type="text"
                  placeholder="Jean"
                  required
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="signup-livreur-vehicule" className="block text-sm font-serif font-medium text-wood-800">Type de véhicule</label>
            <div className="relative">
              <i className="bx bx-car absolute left-3 top-3 text-wood-400"></i>
              <select
                id="signup-livreur-vehicule"
                name="vehicule"
                required
                value={formData.vehicule}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-wood-200 font-serif rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un véhicule</option>
                <option value="velo">Vélo</option>
                <option value="scooter">Scooter</option>
                <option value="voiture">Voiture</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="signup-livreur-zone" className="block text-sm font-serif font-medium text-wood-800">Zone de livraison</label>
            <div className="relative">
              <i className="bx bx-map-alt absolute left-3 top-3 text-wood-400"></i>
              <input
                id="signup-livreur-zone"
                name="zone"
                type="text"
                placeholder="Paris 1er, 2ème, 3ème"
                required
                value={formData.zone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="w-4 h-4 mt-1 rounded border-wood-300 text-wood-600 focus:ring-wood-500"
        />
        <label htmlFor="terms" className="text-sm text-wood-700">
          J'accepte les{' '}
          <a href="/terms" className="text-wood-600 hover:text-wood-700 font-medium">
            conditions d'utilisation
          </a>
        </label>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Création du compte..." : "Créer un compte"}
      </button>
    </form>
  );
};

export default Register;