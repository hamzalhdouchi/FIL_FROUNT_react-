import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import {useState  } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-wood-800 text-white py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-playfair font-bold">
          Serve Quick
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="#restaurants" className="hover:text-wood-100 transition">
            Restaurants
          </Link>
          <Link href="#about" className="hover:text-wood-100 transition">
            À propos
          </Link>
          <Link href="#reservation" className="hover:text-wood-100 transition">
            Réservation
          </Link>
          <Link href="#reviews" className="hover:text-wood-100 transition">
            Avis
          </Link>
          <Link href="#contact" className="hover:text-wood-100 transition">
            Contact
          </Link>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-wood-800">
          <div className="flex flex-col space-y-2">
            <Link
              href="#restaurants"
              className="hover:text-wood-100 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link href="#about" className="hover:text-wood-100 transition py-2" onClick={() => setIsMenuOpen(false)}>
              À propos
            </Link>
            <Link
              href="#reservation"
              className="hover:text-wood-100 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Réservation
            </Link>
            <Link href="#reviews" className="hover:text-wood-100 transition py-2" onClick={() => setIsMenuOpen(false)}>
              Avis
            </Link>
            <Link href="#contact" className="hover:text-wood-100 transition py-2" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
 