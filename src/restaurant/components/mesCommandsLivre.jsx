    import { useNavigate } from 'react-router-dom';

    const MesCommandesButtonLIVR = ({ restaurant_id, openTableReservationModal }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(`/Livraisons/${restaurant_id}`);
    };

    return (

        <section className="py-16 bg-wood-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Saveurs à Domicile</h2>
          <p className="text-wood-700 mb-8 max-w-2xl mx-auto">
            Laissez la magie culinaire venir à vous - suivez vos festins en route et orchestrez vos expériences
            gastronomiques en quelques clics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleNavigation}
              className="bg-wood-700 hover:bg-wood-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
            >
              Mes Livraisons
            </button>
  
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={openTableReservationModal}
                className="bg-wood-700 hover:bg-wood-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
              >
                Réserver Table
              </button>
            </div>
          </div>
        </div>
      </section>
    );
    };

    export default MesCommandesButtonLIVR;
