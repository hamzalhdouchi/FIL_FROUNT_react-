import React, {useState ,useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom"
import { _limitValue } from 'chart.js/helpers';

export default function Restaurants() {
  const [restaurants , setRestaurants] = useState([]);

   useEffect( () => {
    const fetchData = async () => {
      try{

        const response = await axios.get(`http://127.0.0.1:8000/api/restaurants`);
        const limitedRestaurants = response.data.original.data.data.slice(0, 3);
        setRestaurants(limitedRestaurants)
        sessionStorage.setItem('restaurant', JSON.stringify(limitedRestaurants));
        console.log(limitedRestaurants);
        
      }catch(err)
      {
        console.log('Erreur lors de la récupération des restaurants:', err);
        
      };
    }
    fetchData();
  },[]);
  
  return (
    <section id="restaurants" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">Nos Restaurants Partenaires</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants?.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-wood-50 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                    <img src={restaurant.logo || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair">{restaurant.name}</h3>
                </div>
                <p className={restaurant.isOlive ? "text-olive-700 mb-4" : "text-wood-700 mb-4"}>
                  {restaurant.description}
                </p>
                <Link
                  to={`/menu/${restaurant.id}`}
                  className={
                    restaurant.isOlive
                      ? "text-olive-600 hover:text-olive-800 font-semibold"
                      : "text-wood-700 hover:text-wood-900 font-semibold"
                  }
                >
                  Voir le menu →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/Restaurants`}
            className="inline-block bg-wood-500 hover:bg-wood-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            Voir tous les restaurants
          </Link>
        </div>
      </div>
    </section>
  )
}
