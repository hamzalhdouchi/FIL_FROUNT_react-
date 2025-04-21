import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { stringify } from "postcss";


  // const token = sessionStorage.getItem('token');
  // if (token) {
  //   sessionStorage.removeItem('token');
  // }
const Login = ({ isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);
    
      if (response.status === 200) {
        const { token } = response.data;
        sessionStorage.setItem("token", token);
        console.log(token);
        
        const role = response.data.user.role_id;
      const user = response.data.user;
      sessionStorage.setItem('user', JSON.stringify(user));
      Swal.fire({
          icon: "success",
          title: response.data.message,
          text: "Bienvenue sur votre tableau de bord",
          timer: 2000,
          showConfirmButton: false,
        });
  
        if (role === 1) {
          window.location.href = "/home";
        } else if (role === 2 || role === 3) {
          window.location.href = "/dashboard";
        }
      }
  
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data);
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
  );
};

export default Login;