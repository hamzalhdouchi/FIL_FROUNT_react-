import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom_Utilisateur: "",
    prenom: "",
    telephone: "",
    role_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", data);

      if (response.status === 200) {
        console.log(response.data);
        
        const { token } = response.data;
        console.log(token);
        
        localStorage.setItem("token", token);
        
        Swal.fire({
          icon: "success",
          title: response.data.message,
          text: "Bienvenue sur votre tableau de bord",
          timer: 2000,
          showConfirmButton: false,
        });

        if (response.data.user.role_id === 1) {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }else{
          console.log('sir t9awed');
          
        }

      }
    } catch (err) {
      console.log("Login error:", err.response?.data); 
      Swal.fire({
        icon: "error",
        title: "Erreur de connexion",
        text: err.response?.data?.message || "Email ou mot de passe incorrect",
      });
  };
}

  const handleRegister = async (data) => {
    try {
        
      const response = await axios.post("http://localhost:8000/api/register", data);
      Swal.fire({
        title: "Succès!",
        text: response.data.message || "Compte créé avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.log(err.response?.data);
      Swal.fire({
        title: "Erreur!",
        text: err.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e, type) => {
    
    e.preventDefault();
    setIsLoading(true);
    const { nom_Utilisateur, prenom, email, password, telephone, role_id } = formData;
    let data = {};
    if (type === "login") {
      data = { email, password };
      console.log('Données de login:', data);
         
    }
    
    if (type === "signup") {
      data = { nom_Utilisateur, prenom, email, password, telephone, role_id };
      
      
    }

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le champ email et mot de passe sont requis.",
      });
      setIsLoading(false);
      return;
    }

    if (type === "login") {
      await handleLogin(data);
    } else {
      await handleRegister(data);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-wood-100 to-white min-h-screen">
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className=" lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-wood-900/70 to-wood-800/50 z-10"></div>
          <img
            src="https://restaurant-lasiesta.fr/wp-content/uploads/2022/12/la-siesta-restaurant-canet-en-roussillon-2-570x855.jpeg"
            alt="Restaurant interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center items-center p-12 text-white">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">Serve Quick</h1>
              <p className="text-xl max-w-md text-wood-100/90">
                Welcome to our culinary experience. Sign in to explore our menu and make reservations.
              </p>
            </div>
            <div className="mt-8 flex space-x-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Fine Dining</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Reservations</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Delivery</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-wood-500 to-wood-700 flex items-center justify-center shadow-lg shadow-wood-200">
                <i className="bx bx-restaurant text-5xl text-white"></i>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-wood-900">Welcome back</h2>
              <p className="mt-2 text-wood-700">
                Sign in to your account or create a new one
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-wood-100 p-8 mb-8 border border-wood-200">
              <div className="w-full mb-8">
                <div className="grid w-full grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`py-2.5 px-4 font-medium rounded-lg ${
                      activeTab === "login" ? "bg-wood-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`py-2.5 px-4 font-medium rounded-lg ${
                      activeTab === "signup" ? "bg-wood-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {activeTab === "login" && (
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="login-email" className="block text-sm font-medium text-wood-800">Email</label>
                      <div className="relative">
                        <i className="bx bx-envelope absolute left-3 top-3 text-wood-400"></i>
                        <input
                          id="login-email"
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
                      <div className="flex items-center justify-between">
                        <label htmlFor="login-password" className="block text-sm font-medium text-wood-800">Password</label>
                        <a href="#" className="text-sm text-wood-600 hover:text-wood-700 font-medium">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <i className="bx bx-lock-alt absolute left-3 top-3 text-wood-400"></i>
                        <input
                          id="login-password"
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

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-wood-300 text-wood-600 focus:ring-wood-500"
                      />
                      <label htmlFor="remember" className="text-sm font-medium text-wood-700">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              )}
                {/* Signup Form */}
                {activeTab === "signup" && (
                <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-6">
                    <div className="space-y-4">
                    
                    {/* Nom Utilisateur */}
                    <div className="space-y-2">
                        <label htmlFor="signup-nomUtilisateur" className="block text-sm font-medium text-wood-800">Nom d'utilisateur</label>
                        <div className="relative">
                        <i className="bx bx-user absolute left-3 top-3 text-wood-400"></i>
                        <input
                            id="signup-nomUtilisateur"
                            name="nom_Utilisateur"
                            type="text"
                            placeholder="Votre nom d'utilisateur"
                            required
                            value={formData.nom_Utilisateur}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                        />
                        </div>
                    </div>

                    {/* Prénom */}
                    <div className="space-y-2">
                        <label htmlFor="signup-prenom" className="block text-sm font-medium text-wood-800">Prénom</label>
                        <div className="relative">
                        <i className="bx bx-user-circle absolute left-3 top-3 text-wood-400"></i>
                        <input
                            id="signup-prenom"
                            name="prenom"
                            type="text"
                            placeholder="Votre prénom"
                            required
                            value={formData.prenom}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                        />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="signup-email" className="block text-sm font-medium text-wood-800">Email</label>
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

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="signup-password" className="block text-sm font-medium text-wood-800">Password</label>
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

                    {/* Telephone */}
                    <div className="space-y-2">
                        <label htmlFor="signup-telephone" className="block text-sm font-medium text-wood-800">Téléphone</label>
                        <div className="relative">
                        <i className="bx bx-phone absolute left-3 top-3 text-wood-400"></i>
                        <input
                            id="signup-telephone"
                            name="telephone"
                            type="text"
                            placeholder="Votre numéro de téléphone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                        />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label htmlFor="signup-role" className="block text-sm font-medium text-wood-800">Sélectionner un rôle</label>
                        <div className="relative">
                        <i className="bx bx-user-check absolute left-3 top-3 text-wood-400"></i>
                        <select
                            id="signup-role"
                            name="role_id"
                            required
                            value={formData.role_id}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-wood-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="1">Restaurant</option>
                            <option value="2">Client</option>
                            <option value="3">Livreur</option>
                        </select>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                        <input
                        type="checkbox"
                        id="terms"
                        required
                        className="w-4 h-4 mt-1 rounded border-wood-300 text-wood-600 focus:ring-wood-500"
                        />
                        <label htmlFor="terms" className="text-sm text-wood-700">
                        J'accepte les
                        <a href="#" className="text-wood-600 hover:text-wood-700 font-medium">
                            termes et conditions
                        </a>
                        </label>
                    </div>
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-wood-600 to-wood-700 text-white font-medium rounded-lg hover:from-wood-700 hover:to-wood-800 transition-all shadow-md hover:shadow-lg"
                    disabled={isLoading}
                    >
                    {isLoading ? "Création du compte..." : "Créer un compte"}
                    </button>
                </form>
                )}


            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-wood-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-wood-50 px-4 text-wood-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-wood-200 rounded-lg font-medium text-wood-700 hover:bg-wood-50 transition-colors shadow-sm"
              >
                <i className="bx bxl-google text-xl mr-2"></i> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-wood-200 rounded-lg font-medium text-wood-700 hover:bg-wood-50 transition-colors shadow-sm"
              >
                <i className="bx bxl-facebook text-xl mr-2 text-blue-600"></i> Facebook
              </button>
            </div>

            <div className="mt-8 text-center text-wood-500 text-sm">
              <p>© 2025 Serve Quick. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
