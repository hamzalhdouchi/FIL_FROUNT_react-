import { Link } from "react-router-dom"
import Button from "../components/ui/button"
import Input from "../components/ui/input"


export default function Footer() {
  return (
    <footer className="bg-wood-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">GourmetTable</h3>
            <p className="mb-4">
              La meilleure façon de découvrir et réserver dans les restaurants de qualité près de chez vous.
            </p>
            <p>&copy; {new Date().getFullYear()} GourmetTable. Tous droits réservés.</p>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-wood-100 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#restaurants" className="hover:text-wood-100 transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-wood-100 transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#reservation" className="hover:text-wood-100 transition">
                  Réservation
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-wood-100 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-wood-100 transition">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wood-100 transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wood-100 transition">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-wood-100 transition">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Newsletter</h3>
            <p className="mb-4">
              Inscrivez-vous pour recevoir nos offres spéciales et découvrir les nouveaux restaurants.
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Votre email"
                className="rounded-l-md focus:outline-none text-gray-800 w-full"
              />
              <Button
                type="submit"
                className="bg-wood-500 hover:bg-wood-400 text-white px-4 rounded-r-md transition duration-300"
              >
                OK
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
