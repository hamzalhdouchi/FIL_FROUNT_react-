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

export default function Home() {

  const [restaurants , setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);


   useEffect( () => {
    const fetchData = async () => {
      try{

        const response = await axios.get(`http://127.0.0.1:8000/api/restaurants`);
        const limitedRestaurants = response.data.original.data.data.slice(0, 3);
        setRestaurants(limitedRestaurants)
        sessionStorage.setItem('restaurant', JSON.stringify(limitedRestaurants));
        setLoading(false);
      }catch(err)
      {
        console.log('Erreur lors de la récupération des restaurants:', err);
        setLoading(false);

      };
    }
    fetchData();
  },[]);

  
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
      <AddIngredientForm />
      <Restaurants restaurants={restaurants}/>
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
