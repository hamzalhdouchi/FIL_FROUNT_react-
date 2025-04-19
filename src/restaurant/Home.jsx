import Navbar from "./components/navbar"
import Hero from "./components/hero"
import Restaurants from "./components/restaurants"
import About from "./components/about"
import Reviews from "./components/reviews"
import Contact from "./components/contact"
import Footer from "./components/layout/Footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Restaurants />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
