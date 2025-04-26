import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"

export default function Reservation() {
  const [formData, setFormData] = useState({
    restaurant: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    name: "",
    email: "",
    phone: "",
    notes: "",  
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section id="reservation" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Réserver une Table</h2>

        <div className="max-w-2xl mx-auto bg-wood-50 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor="restaurant" className="text-wood-700 font-medium mb-2">
                Restaurant
              </Label>
              <Select onValueChange={(value) => handleSelectChange("restaurant", value)}>
                <SelectTrigger id="restaurant">
                  <SelectValue placeholder="Choisissez un restaurant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="le-gourmet">Le Gourmet</SelectItem>
                  <SelectItem value="saveurs-italie">Saveurs d'Italie</SelectItem>
                  <SelectItem value="green-garden">Green Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="date" className="text-wood-700 font-medium mb-2">Date</Label>
                <Input type="date" id="date" value={formData.date} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
              </div>
              <div>
                <Label htmlFor="time" className="text-wood-700 font-medium mb-2">Heure</Label>
                <Input type="time" id="time" value={formData.time} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="guests" className="text-wood-700 font-medium mb-2">Nombre de personnes</Label>
                <Input type="number" id="guests" min="1" max="20" value={formData.guests} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
              </div>
              <div>
                <Label htmlFor="occasion" className="text-wood-700 font-medium mb-2">Occasion (optionnel)</Label>
                <Select onValueChange={(value) => handleSelectChange("occasion", value)}>
                  <SelectTrigger id="occasion">
                    <SelectValue placeholder="Sélectionnez une occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Anniversaire</SelectItem>
                    <SelectItem value="anniversary">Anniversaire de mariage</SelectItem>
                    <SelectItem value="business">Repas d'affaires</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="name" className="text-wood-700 font-medium mb-2">Nom complet</Label>
              <Input type="text" id="name" value={formData.name} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="email" className="text-wood-700 font-medium mb-2">Email</Label>
                <Input type="email" id="email" value={formData.email} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-wood-700 font-medium mb-2">Téléphone</Label>
                <Input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="notes" className="text-wood-700 font-medium mb-2">Notes spéciales (optionnel)</Label>
              <Textarea id="notes" rows="3" value={formData.notes} onChange={handleChange} className="focus:ring-2 focus:ring-wood-500" />
            </div>

            <Button type="submit" className="w-full bg-wood-700 hover:bg-wood-800 text-white font-bold py-3 px-4 rounded-md transition duration-300">
              Confirmer la Réservation
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
