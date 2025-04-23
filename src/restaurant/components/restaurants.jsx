import { Link } from "react-router-dom"

export default function Restaurants({ restaurants }) {
  
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
