import { Link } from "react-router-dom";
import restaurantVideo from "../../asset/videos/video.mp4"

export default function Hero() {
  return (
    <section className="relative h-[60vh]">
    <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute top-0 left-0 w-full h-full object-cover"
  preload="auto"
>
            <source src={restaurantVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          Découvrez les Meilleurs Restaurants
        </h1>
        <p className="text-xl md:text-2xl font-serif mb-8 max-w-2xl">
          Réservez une table dans les restaurants les plus raffinés de votre ville en quelques clics
        </p>
      </div>
    </section>
  );
}
