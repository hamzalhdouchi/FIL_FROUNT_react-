import Hero from "./components/hero"
import Restaurants from "./components/restaurants"
import About from "./components/about"
import Reviews from "./components/reviews"
import Contact from "./components/contact"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/header"
import { useEffect, useState } from "react"
import axios from "axios"
import AddIngredientForm from "./components/test"
import Swal from "sweetalert2"

export default function Home() {

  const [restaurants , setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
            const token = sessionStorage.getItem("token");
            const userData = JSON.parse(sessionStorage.getItem("user"));
            if (userData) {
                const role = userData.role_id;
                if (role !== 4) {
                }
            }
            if (!token || !userData) {
                
            window.location.href ='/'
            }
            
            }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = sessionStorage.getItem('user');
        if (!userData) {
          window.location.href = '/';
          return;
        }
  
        const user = JSON.parse(userData);
        const role = user?.role_id;
  
        if (role !== 1) {
          Swal.fire({
            icon: "error",
            title: "Accès refusé",
            text: "Vous n'avez pas le rôle requis pour accéder à cette page.",
            timer: 2000,
            showConfirmButton: false,
          });
          window.location.href = '/';
          return;
        }
  
        const { data } = await axios.get("http://127.0.0.1:8000/api/restaurants/accepted");
        const restaurants = data?.original?.data?.data?.slice(0, 3) || [];
        console.log(restaurants);
        
        setRestaurants(restaurants);
        sessionStorage.setItem('restaurant', JSON.stringify(restaurants));
      } catch (err) {
        console.error('Erreur lors de la récupération des restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-wood-700 border-solid"></div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Header />
      <Hero />
        <Restaurants restaurants={restaurants}/>
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
