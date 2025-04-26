import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = ({ isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);

      if (response.status === 200) {
        const { token, user, message } = response.data;
        const role = user.role_id;
        const user_id = user.id;
        if (role === 2) {   
          const restaurant = response.data.restaurant;
          const menu = response.data.restaurant.menu;
          sessionStorage.setItem("menu", JSON.stringify(menu));
          sessionStorage.setItem("restaurant",JSON.stringify(restaurant) )
        }

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("user", JSON.stringify(user));
      


        if (role === 2) {
          const res = await axios.get(`http://localhost:8000/api/restaurants/${user_id}`);          const restaurantData = res.data.original.data;
                    
          if (restaurantData.status === 'accepted') {
            sessionStorage.setItem("restaurant", JSON.stringify(restaurantData));
            Swal.fire({
              icon: "success",
              title: message,
              text: "Bienvenue sur votre tableau de bord",
              timer: 2000,
              showConfirmButton: false,
            });
            window.location.href = "/commandes";
          }else if (restaurantData.status === 'rejected') {
            Swal.fire({
              icon: "error",
              title: "Erreur de connexion",
              text: "Votre restaurant a été refusé",
            });
          }else if (restaurantData.status === 'En Attent') {
            Swal.fire({
              icon: "error",
              title: "Erreur de connexion",
              text: "Votre restaurant est en attente de validation",
            });
          }

        } else if (role === 1) {
          if (user.statut === 'actif') {
            Swal.fire({
              icon: "success",
              title: message,
              text: "Bienvenue sur votre tableau de bord",
              timer: 2000,
              showConfirmButton: false,
            });
            const redirectUrl = sessionStorage.getItem("redirect_url");
            if (redirectUrl) {
              window.location.href = redirectUrl;
              sessionStorage.removeItem("redirect_url");
            }else{
              setTimeout(() => {
                window.location.href = '/home'
              }, 2500);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Erreur de connexion",
              text: "Votre compte est désactivé",
            });
          }

        } else if (role === 3) {
          Swal.fire({
            icon: "success",
            title: message,
            text: "Bienvenue sur votre tableau de bord",
            timer: 1000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1200);
        }
      }
    } catch (err) {
      console.error("Erreur de connexion :", err);
      Swal.fire({
        icon: "error",
        title: "Erreur de connexion",
        text: err.response?.data?.message || "Email ou mot de passe incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="login-email" className="block font-serif text-sm font-medium text-wood-800">
            Email
          </label>
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
            <label htmlFor="login-password" className="block text-sm font-serif font-medium text-wood-800">
              Password
            </label>
            <a href="#" className="text-sm text-wood-600 font-serif hover:text-wood-700 font-medium">
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
  );
};

export default Login;
