import React, { useState } from "react"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
  }

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">Contactez-nous</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form className="bg-wood-50 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="text-wood-700 font-medium mb-2 block">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-wood-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="text-wood-700 font-medium mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-wood-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="text-wood-700 font-medium mb-2 block">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-wood-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="text-wood-700 font-medium mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-wood-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-wood-700 hover:bg-wood-800 text-white font-bold py-3 px-4 rounded-md transition duration-300"
              >
                Envoyer le Message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-playfair font-bold mb-4">Informations de Contact</h3>
              <p className="text-wood-700 mb-6">
                N'hésitez pas à nous contacter pour toute question ou suggestion. Notre équipe est à votre disposition
                pour vous aider.
              </p>

              <div className="flex items-start mb-4">
                <Mail className="h-6 w-6 text-wood-700 mr-3 mt-1" />
                <span className="text-wood-700">contact@gourmettable.fr</span>
              </div>

              <div className="flex items-start mb-4">
                <Phone className="h-6 w-6 text-wood-700 mr-3 mt-1" />
                <span className="text-wood-700">01 23 45 67 89</span>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-wood-700 mr-3 mt-1" />
                <span className="text-wood-700">
                  123 Avenue de la Gastronomie
                  <br />
                  75001 Paris, France
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-playfair font-bold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-wood-500 hover:bg-wood-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-wood-500 hover:bg-wood-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-wood-500 hover:bg-wood-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
