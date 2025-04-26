import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const AperçuStats = () => {
  const [stats, setStats] = useState({
    totalCommandes: 0,
    sousTotalCommandes: 0,
    totalCommandesAcceptees: 0,
    totalReservations: 0,
    totalPrix: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const totalCommandesResponse = await Axios.get('http://localhost:8000/api/commandes/total/3');
        const sousTotalResponse = await Axios.get('http://localhost:8000/api/commandes/sous-total/3');
        const Response = await Axios.get('http://localhost:8000/api/commandes/restaurant/3');
        const totalReservationsResponse = await Axios.get('http://localhost:8000/api/reservations/1');

const totalCommandesAcceptees = Response.data.data
        console.log(totalCommandesAcceptees);
        
        let total = 0;
        let acc = 0
        totalCommandesAcceptees.forEach(com => {
          if (com.statut === 'acceptée') {
            total += com.prix;
            acc += 1;
          }
        });

        setStats({
          totalCommandes: totalCommandesAcceptees.data.length,
          sousTotalCommandes: sousTotalResponse.data.sousTotal,
          
          totalCommandesAcceptees: acc,
          totalPrix: total,
          totalReservations: totalReservationsResponse.data.length,

        });

        console.log( sousTotalResponse.data.sousTotal, totalCommandesAcceptees, totalReservationsResponse.data.length);
        console.log(totalCommandesAcceptees.data.length, totalReservationsResponse.data.length);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold text-wood-800 mb-4">Aperçu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-wood-700">Commandes Totales</h4>
            <div className="w-12 h-12 rounded-full bg-olive-100 flex items-center justify-center">
              <i className="bx bxs-receipt text-2xl text-olive-600"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-wood-900 mb-1">{stats.totalCommandes}</p>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <i className="bx bx-up-arrow-alt"></i> 15.3%
            </span>
            <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-wood-700">Commandes Acceptées</h4>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <i className="bx bxs-check-circle text-2xl text-green-600"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-wood-900 mb-1">{stats.totalCommandesAcceptees}</p>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <i className="bx bx-up-arrow-alt"></i> 10.2%
            </span>
            <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-wood-700">Réservations</h4>
            <div className="w-12 h-12 rounded-full bg-wood-100 flex items-center justify-center">
              <i className="bx bxs-calendar-check text-2xl text-wood-600"></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-wood-900 mb-1">{stats.totalReservations}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
  <div className="flex items-center justify-between mb-4">
    <h4 className="font-medium text-wood-700">Prix Totaux des commandes</h4>
    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
      <i className="bx bxs-wallet text-2xl text-green-600"></i>
    </div>
  </div>
  <p className="text-3xl font-bold text-wood-900 mb-1">{stats.totalPrix} DH</p>
</div>


        
      </div>
    </section>
  );
};

export default AperçuStats;
