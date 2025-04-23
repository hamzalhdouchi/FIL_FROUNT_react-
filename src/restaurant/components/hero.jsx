import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">Découvrez les Meilleurs Restaurants</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Réservez une table dans les restaurants les plus raffinés de votre ville en quelques clics
        </p>
        <Link
          href="#reservation"
          className="bg-wood-500 hover:bg-wood-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg"
        >
          Réserver une Table
        </Link>
      </div>
    </section>
  )
}
    