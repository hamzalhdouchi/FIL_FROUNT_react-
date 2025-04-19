import { Star } from "lucide-react"

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Sophie Martin",
      initial: "S",
      rating: 5,
      text: "J'ai réservé une table pour notre anniversaire de mariage et tout était parfait ! Le restaurant nous a même offert un dessert spécial. Je recommande vivement ce service.",
      color: "wood",
    },
    {
      id: 2,
      name: "Thomas Dubois",
      initial: "T",
      rating: 4,
      text: "Très pratique pour découvrir de nouveaux restaurants et réserver rapidement. L'interface est intuitive et les confirmations sont instantanées.",
      color: "wood",
    },
    {
      id: 3,
      name: "Léa Petit",
      initial: "L",
      rating: 5,
      text: "J'adore découvrir de nouveaux restaurants grâce à cette plateforme. Les descriptions sont précises et les photos donnent vraiment envie d'y aller. Service client très réactif aussi !",
      color: "olive",
    },
  ]

  return (
    <section id="reviews" className="py-16 bg-wood-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">Ce que disent nos clients</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div
                  className={`h-12 w-12 rounded-full bg-${review.color}-500 flex items-center justify-center text-white font-bold text-xl`}
                >
                  {review.initial}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">{review.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className={`text-${review.color}-700`}>{review.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block bg-wood-500 hover:bg-wood-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            Voir plus d'avis
          </a>
        </div>
      </div>
    </section>
  )
}
