// import { useEffect } from 'react';
// import { Chart } from 'chart.js/auto';
// import CommandDash from './components/CommandDach';

// const DashboardRestaurant = () => {
//   useEffect(() => {
//     // Initialisation des graphiques
//     const commandesCtx = document.getElementById('commandesChart').getContext('2d');
//     const reservationsCtx = document.getElementById('reservationsChart').getContext('2d');

//     // new Chart(commandesCtx, {
//     //   type: 'line',
//     //   data: {
//     //     labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
//     //     datasets: [{
//     //       label: 'Commandes',
//     //       data: [25, 32, 28, 42, 38, 52, 48],
//     //       backgroundColor: 'rgba(189, 140, 94, 0.2)',
//     //       borderColor: 'rgba(189, 140, 94, 1)',
//     //       borderWidth: 2,
//     //       tension: 0.3,
//     //       fill: true
//     //     }]
//     //   },
//     //   options: {
//     //     responsive: true,
//     //     maintainAspectRatio: false,
//     //     scales: {
//     //       y: {
//     //         beginAtZero: true
//     //       }
//     //     }
//     //   }
//     // });

//     // new Chart(reservationsCtx, {
//     //   type: 'bar',
//     //   data: {
//     //     labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
//     //     datasets: [{
//     //       label: 'Réservations',
//     //       data: [8, 12, 10, 15, 20, 25, 18],
//     //       backgroundColor: 'rgba(141, 156, 90, 0.7)',
//     //       borderColor: 'rgba(141, 156, 90, 1)',
//     //       borderWidth: 1
//     //     }]
//     //   },
//     //   options: {
//     //     responsive: true,
//     //     maintainAspectRatio: false,
//     //     scales: {
//     //       y: {
//     //         beginAtZero: true
//     //       }
//     //     }
//     //   }
//     // });

//     // Gestion de la sidebar mobile
//     const sidebarToggle = document.getElementById('sidebar-toggle');
//     const mobileSidebar = document.getElementById('mobile-sidebar');
//     const mobileSidebarContent = document.getElementById('mobile-sidebar-content');
//     const closeSidebar = document.getElementById('close-sidebar');
    
//     sidebarToggle.addEventListener('click', () => {
//       mobileSidebar.classNameList.remove('hidden');
//       setTimeout(() => {
//         mobileSidebarContent.classNameList.remove('-translate-x-full');
//       }, 10);
//     });
    
//     closeSidebar.addEventListener('click', () => {
//       mobileSidebarContent.classNameList.add('-translate-x-full');
//       setTimeout(() => {
//         mobileSidebar.classNameList.add('hidden');
//       }, 300);
//     });
//   }, []);

//   return (
//     <div className="bg-wood-50">
//   <div className="min-h-screen flex">
//     <aside className="w-64 bg-wood-800 text-white fixed h-full z-10 hidden md:block">
//       <div className="p-4 border-b border-wood-700">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
//             <i className='bx bx-restaurant text-xl'></i>
//           </div>
//           <div>
//             <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
//             <p className="text-xs text-wood-300">Gestion Restaurant</p>
//           </div>
//         </div>
//       </div>
      
//       <nav className="mt-6">
//         <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
//         <a href="#dashboard" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
//           <i className='bx bxs-dashboard text-xl mr-3'></i>
//           <span>Tableau de Bord</span>
//         </a>
//         <a href="#commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-receipt text-xl mr-3'></i>
//           <span>Gestion des Commandes</span>
//         </a>
//         <a href="#reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-calendar-check text-xl mr-3'></i>
//           <span>Gestion des Réservations</span>
//         </a>
//         <a href="#clients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-user-account text-xl mr-3'></i>
//           <span>Gestion des Clients</span>
//         </a>
//         <a href="#livreurs" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-truck text-xl mr-3'></i>
//           <span>Gestion des Livreurs</span>
//         </a>
//         <a href="#statistics" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-bar-chart-alt-2 text-xl mr-3'></i>
//           <span>Statistiques</span>
//         </a>
        
//         <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
//         <a href="#profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-user-circle text-xl mr-3'></i>
//           <span>Profil</span>
//         </a>
//         <a href="#settings" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//           <i className='bx bxs-cog text-xl mr-3'></i>
//           <span>Configuration</span>
//         </a>
//       </nav>
      
//       <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
//         <a href="#logout" className="flex items-center text-wood-300 hover:text-white">
//           <i className='bx bx-log-out text-xl mr-3'></i>
//           <span>Déconnexion</span>
//         </a>
//       </div>
//     </aside>
    
//     <div className="fixed bottom-4 right-4 md:hidden z-20">
//       <button id="sidebar-toggle" className="bg-wood-700 text-white p-3 rounded-full shadow-lg">
//         <i className='bx bx-menu text-2xl'></i>
//       </button>
//     </div>
    
//     <div id="mobile-sidebar" className="fixed inset-0 bg-black bg-opacity-50 z-30 hidden">
//       <div className="bg-wood-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-300 -translate-x-full" id="mobile-sidebar-content">
//         <div className="p-4 border-b border-wood-700 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
//               <i className='bx bx-restaurant text-xl'></i>
//             </div>
//             <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
//           </div>
//           <button id="close-sidebar" className="text-wood-300 hover:text-white">
//             <i className='bx bx-x text-2xl'></i>
//           </button>
//         </div>
        
//         <nav className="mt-6">
//           <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
//           <a href="#dashboard" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
//             <i className='bx bxs-dashboard text-xl mr-3'></i>
//             <span>Tableau de Bord</span>
//           </a>
//           <a href="#commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-receipt text-xl mr-3'></i>
//             <span>Gestion des Commandes</span>
//           </a>
//           <a href="#reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-calendar-check text-xl mr-3'></i>
//             <span>Gestion des Réservations</span>
//           </a>
//           <a href="#clients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-user-account text-xl mr-3'></i>
//             <span>Gestion des Clients</span>
//           </a>
//           <a href="#livreurs" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-truck text-xl mr-3'></i>
//             <span>Gestion des Livreurs</span>
//           </a>
//           <a href="#statistics" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-bar-chart-alt-2 text-xl mr-3'></i>
//             <span>Statistiques</span>
//           </a>
          
//           <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
//           <a href="#profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-user-circle text-xl mr-3'></i>
//             <span>Profil</span>
//           </a>
//           <a href="#settings" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
//             <i className='bx bxs-cog text-xl mr-3'></i>
//             <span>Configuration</span>
//           </a>
//         </nav>
//       </div>
//     </div>
    
//     <div className="flex-1 md:ml-64">
//       <header className="bg-white shadow-md border-b border-wood-200 sticky top-0 z-10">
//         <div className="flex justify-between items-center px-6 py-4">
//           <div className="flex items-center space-x-3">
//             <button className="md:hidden text-wood-600">
//               <i className='bx bx-menu text-2xl'></i>
//             </button>
//             <h2 className="text-xl font-bold text-wood-800">Tableau de Bord Restaurant</h2>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//             <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 className="pl-10 pr-4 py-2 rounded-lg border border-wood-200 focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
//                 />
//               <i className='bx bx-search absolute left-3 top-2.5 text-wood-400'></i>
//             </div>
            
//             <button className="relative p-2 text-wood-600 hover:bg-wood-100 rounded-full">
//               <i className='bx bx-bell text-xl'></i>
//               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
            
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 rounded-full bg-wood-200 flex items-center justify-center">
//                 <i className='bx bx-user text-xl text-wood-600'></i>
//               </div>
//               <div className="hidden md:block">
//                 <p className="text-sm font-medium text-wood-800">Chef de Restaurant</p>
//                 <p className="text-xs text-wood-500">chef@bonappetit.com</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       <main className="p-6">
//         <section className="mb-8">
//           <h3 className="text-xl font-bold text-wood-800 mb-4">Aperçu</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-medium text-wood-700">Commandes Totales</h4>
//                 <div className="w-12 h-12 rounded-full bg-olive-100 flex items-center justify-center">
//                   <i className='bx bxs-receipt text-2xl text-olive-600'></i>
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-wood-900 mb-1">1,248</p>
//               <div className="flex items-center text-sm">
//                 <span className="text-green-500 flex items-center">
//                   <i className='bx bx-up-arrow-alt'></i> 15.3%
//                 </span>
//                 <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-medium text-wood-700">Réservations</h4>
//                 <div className="w-12 h-12 rounded-full bg-wood-100 flex items-center justify-center">
//                   <i className='bx bxs-calendar-check text-2xl text-wood-600'></i>
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-wood-900 mb-1">86</p>
//               <div className="flex items-center text-sm">
//                 <span className="text-green-500 flex items-center">
//                   <i className='bx bx-up-arrow-alt'></i> 8.2%
//                 </span>
//                 <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-medium text-wood-700">Clients Totaux</h4>
//                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                   <i className='bx bxs-user-account text-2xl text-blue-600'></i>
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-wood-900 mb-1">745</p>
//               <div className="flex items-center text-sm">
//                 <span className="text-green-500 flex items-center">
//                   <i className='bx bx-up-arrow-alt'></i> 12.7%
//                 </span>
//                 <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-medium text-wood-700">Livreurs Actifs</h4>
//                 <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
//                   <i className='bx bxs-truck text-2xl text-purple-600'></i>
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-wood-900 mb-1">12</p>
//               <div className="flex items-center text-sm">
//                 <span className="text-green-500 flex items-center">
//                   <i className='bx bx-up-arrow-alt'></i> 2 nouveaux
//                 </span>
//                 <span className="text-wood-500 ml-2">Depuis le mois dernier</span>
//               </div>
//             </div>
//           </div>
//         </section>
        
//         <CommandDash />

        
//         <section id="reservations" className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-bold text-wood-800">Gestion des Réservations</h3>
//             <button className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center btn-text">
//               <i className='bx bx-plus mr-2'></i> Nouvelle Réservation
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden lg:col-span-2">
//               <div className="p-4 border-b border-wood-100 bg-wood-50">
//                 <h4 className="font-medium text-wood-700">Calendrier des Réservations</h4>
//               </div>
//               <div className="p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <button className="text-wood-600 hover:text-wood-900">
//                     <i className='bx bx-chevron-left'></i>
//                   </button>
//                   <h5 className="text-lg font-medium text-wood-800">Avril 2025</h5>
//                   <button className="text-wood-600 hover:text-wood-900">
//                     <i className='bx bx-chevron-right'></i>
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-7 gap-2 mb-2 text-center">
//                   <div className="text-sm font-medium text-wood-700">Lun</div>
//                   <div className="text-sm font-medium text-wood-700">Mar</div>
//                   <div className="text-sm font-medium text-wood-700">Mer</div>
//                   <div className="text-sm font-medium text-wood-700">Jeu</div>
//                   <div className="text-sm font-medium text-wood-700">Ven</div>
//                   <div className="text-sm font-medium text-wood-700">Sam</div>
//                   <div className="text-sm font-medium text-wood-700">Dim</div>
//                 </div>
                
//                 <div className="grid grid-cols-7 gap-2">
//                   <div className="h-20 p-1 border border-wood-100 rounded-md text-wood-400">29</div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md text-wood-400">30</div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md text-wood-400">31</div>
                  
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">1</div>
//                     <div className="text-xs text-green-600 mt-1">3 réservations</div>
//                   </div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">2</div>
//                     <div className="text-xs text-green-600 mt-1">5 réservations</div>
//                   </div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md bg-wood-100">
//                     <div className="text-sm font-bold">3</div>
//                     <div className="text-xs text-green-600 mt-1">8 réservations</div>
//                   </div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">4</div>
//                     <div className="text-xs text-green-600 mt-1">4 réservations</div>
//                   </div>
                  
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">5</div>
//                     <div className="text-xs text-green-600 mt-1">6 réservations</div>
//                   </div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">6</div>
//                     <div className="text-xs text-green-600 mt-1">7 réservations</div>
//                   </div>
//                   <div className="h-20 p-1 border border-wood-100 rounded-md">
//                     <div className="text-sm">7</div>
//                     <div className="text-xs text-green-600 mt-1">2 réservations</div>
//                   </div>
                  
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
//               <div className="p-4 border-b border-wood-100 bg-wood-50">
//                 <h4 className="font-medium text-wood-700">Réservations à Venir</h4>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-4">
//                   <div className="border-b border-wood-100 pb-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h5 className="font-medium text-wood-800">Famille Dubois</h5>
//                         <p className="text-sm text-wood-600">4 personnes • Table 8</p>
//                         <p className="text-sm text-wood-600">Aujourd'hui, 19:30</p>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-edit'></i>
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <i className='bx bx-x-circle'></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border-b border-wood-100 pb-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h5 className="font-medium text-wood-800">Anniversaire Martin</h5>
//                         <p className="text-sm text-wood-600">8 personnes • Table 12</p>
//                         <p className="text-sm text-wood-600">Aujourd'hui, 20:00</p>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-edit'></i>
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <i className='bx bx-x-circle'></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border-b border-wood-100 pb-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h5 className="font-medium text-wood-800">M. et Mme Leroy</h5>
//                         <p className="text-sm text-wood-600">2 personnes • Table 5</p>
//                         <p className="text-sm text-wood-600">Demain, 12:30</p>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-edit'></i>
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <i className='bx bx-x-circle'></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border-b border-wood-100 pb-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h5 className="font-medium text-wood-800">Réunion d'Affaires</h5>
//                         <p className="text-sm text-wood-600">6 personnes • Table 15</p>
//                         <p className="text-sm text-wood-600">Demain, 19:00</p>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-edit'></i>
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <i className='bx bx-x-circle'></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <button className="w-full mt-4 bg-wood-100 hover:bg-wood-200 text-wood-700 px-4 py-2 rounded-lg btn-text">
//                   Voir Toutes les Réservations
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
        
//         <section id="clients" className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-bold text-wood-800">Gestion des Clients</h3>
//             <button className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center btn-text">
//               <i className='bx bx-plus mr-2'></i> Ajouter un Client
//             </button>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
//             <div className="p-4 border-b border-wood-100 bg-wood-50 flex justify-between items-center">
//               <div className="flex items-center space-x-2">
//                 <i className='bx bx-filter text-wood-600'></i>
//                 <span className="font-medium text-wood-700">Filtrer</span>
//                 <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
//                   <option>Tous les Clients</option>
//                   <option>Clients Réguliers</option>
//                   <option>Nouveaux Clients</option>
//                   <option>VIP</option>
//                 </select>
//               </div>
              
//               <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 placeholder="Rechercher clients..."
//                 className="border border-wood-200 rounded-md text-sm px-3 py-1"
//                 />
//                                 <button className="bg-wood-100 hover:bg-wood-200 text-wood-700 px-3 py-1 rounded-md text-sm btn-text">
//                   Rechercher
//                 </button>
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-wood-200">
//                 <thead className="bg-wood-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Client
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Commandes
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Statut
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Dernière Visite
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-wood-200">
//                   <tr>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wood-200 flex items-center justify-center">
//                           <i className='bx bx-user text-wood-600'></i>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-wood-900">Sophie Martin</div>
//                           <div className="text-xs text-wood-500">Client depuis Jan 2023</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-wood-700">sophie.martin@example.com</div>
//                       <div className="text-sm text-wood-700">+33 6 12 34 56 78</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-wood-700">24 commandes</div>
//                       <div className="text-xs text-wood-500">1,250 € dépensés</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
//                         VIP
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">
//                       Aujourd'hui
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-show'></i>
//                         </button>
//                         <button className="text-wood-600 hover:text-wood-900">
//                           <i className='bx bx-edit'></i>
//                         </button>
//                         <button className="text-red-600 hover:text-red-900">
//                           <i className='bx bx-trash'></i>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
            
//             <div className="px-6 py-3 flex items-center justify-between border-t border-wood-200">
//               <div>
//                 <p className="text-sm text-wood-700">
//                   Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur <span className="font-medium">45</span> résultats
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-wood-300 bg-white text-sm font-medium text-wood-500 hover:bg-wood-50">
//                     <i className='bx bx-chevron-left'></i>
//                   </button>
//                   <button className="relative inline-flex items-center px-4 py-2 border border-wood-300 bg-wood-600 text-sm font-medium text-white">
//                     1
//                   </button>
//                   <button className="relative inline-flex items-center px-4 py-2 border border-wood-300 bg-white text-sm font-medium text-wood-700 hover:bg-wood-50">
//                     2
//                   </button>
//                   <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-wood-300 bg-white text-sm font-medium text-wood-500 hover:bg-wood-50">
//                     <i className='bx bx-chevron-right'></i>
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </section>
      
//         <section id="statistics" className="mb-8">
//           <h3 className="text-xl font-bold text-wood-800 mb-4">Statistiques</h3>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex justify-between items-center mb-4">
//                 <h4 className="font-medium text-wood-700">Commandes par Jour</h4>
//                 <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
//                   <option>7 Derniers Jours</option>
//                   <option>30 Derniers Jours</option>
//                 </select>
//               </div>
//               <div className="h-80">
//                 <canvas id="commandesChart"></canvas>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
//               <div className="flex justify-between items-center mb-4">
//                 <h4 className="font-medium text-wood-700">Réservations par Jour</h4>
//                 <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
//                   <option>7 Derniers Jours</option>
//                   <option>30 Derniers Jours</option>
//                 </select>
//               </div>
//               <div className="h-80">
//                 <canvas id="reservationsChart"></canvas>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
      
//       <footer className="bg-white border-t border-wood-200 py-4 px-6 text-center text-wood-600 text-sm">
//         <p className="brand-text">© 2025 Serve Quick. Tous droits réservés.</p>
//       </footer>
//     </div>
//   </div>
//    </div>
//   );
// };

// export default DashboardRestaurant;