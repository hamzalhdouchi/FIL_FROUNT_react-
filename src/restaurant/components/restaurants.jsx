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
        
      }catch(err)
      {
        console.log('Erreur lors de la récupération des restaurants:', err);
        
      };
    }
    fetchData();
  },[]);
  
  return (
    <section id="restaurants" className="py-16 bg-white">
          <img className='ml-10' src="data:image/png;base64,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
" alt="" />
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
                  src="https://www.foxrc.com/wp-content/uploads/2024/09/restaurants-concept-cdo-00.jpg"
                  alt={restaurant.nom_Restaurant}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                    <img src={restaurant.logo || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair">{restaurant.nom_Restaurant}</h3>
                </div>
                <p className={restaurant.isOlive ? "text-olive-700 mb-4" : "text-wood-700 mb-4"}>
                  {restaurant.adresse}
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
