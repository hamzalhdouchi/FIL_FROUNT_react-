import { useNavigate } from 'react-router-dom';

const MesCommandesButton = ({ restaurant_id, table_id, openTableReservationModal }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/commandes/${restaurant_id}/table/${table_id}`);
  };

  return (
    <section className="py-16 bg-wood-100">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Voir vos commandes</h2>
      <p className="text-wood-700 mb-8 max-w-2xl mx-auto">
      Consultez vos commandes en cours et retrouvez facilement les plats que vous avez précommandés pour une expérience culinaire serif attente.      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={handleNavigation}
          className="bg-wood-700 hover:bg-wood-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
        >
          Mes Commandes
        </button>
        </div>
        </div>
  </section>
  );
};

export default MesCommandesButton;
