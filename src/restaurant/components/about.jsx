export default function About() {
    return (
      <section id="about" className="py-16 bg-wood-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-8">À Propos de GourmetTable</h2>
            <p className="text-lg mb-6">
              GourmetTable est né d'une passion pour la gastronomie et d'une volonté de simplifier l'expérience de
              réservation de restaurants pour les amateurs de bonne cuisine.
            </p>
            <p className="text-lg mb-6">
              Notre plateforme connecte les gourmets avec les meilleurs établissements de la région, offrant un service de
              réservation simple et efficace. Nous collaborons uniquement avec des restaurants sélectionnés pour leur
              qualité et leur service exceptionnel.
            </p>
            <p className="text-lg mb-10">
              Pour les restaurateurs, nous proposons une visibilité accrue et un système de gestion des réservations
              intuitif qui optimise leur taux d'occupation.
            </p>
  
            <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="text-center">
                <span className="block text-4xl font-bold text-wood-700 mb-2">150+</span>
                <span className="text-wood-700">Restaurants Partenaires</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-wood-700 mb-2">25 000+</span>
                <span className="text-wood-700">Réservations Mensuelles</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-wood-700 mb-2">4.8/5</span>
                <span className="text-wood-700">Note Moyenne</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  