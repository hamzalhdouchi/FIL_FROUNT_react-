import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BonAppetitDashboard from './restaurant/AdminDachbord'; 
import AuthPage from './restaurant/AuthResataurant';  
import GetUsers  from './restaurant/Users/getAllUsers';
import RestaurantManagement  from './restaurant/getAllRestaurant';
import BonAppetitCategories from './restaurant/categorei';
import RestaurantsPage from './restaurant/RestaurantsPage';
import Home from './restaurant/Home.jsx'
import ReservationsPage from './/restaurant/mesReservation'
import UserProfile from './restaurant/profiel.jsx';
import RestaurantMenuClient from './restaurant/menuPageClient.jsx';
import RestaurantMenuUser from './restaurant/menuPageUser.jsx';
import Page404 from './restaurant/404.jsx';
import CommandesPage from './restaurant/mesCommend.jsx';
import BonAppetitDashboards from './restaurant/restaurantDashbord.jsx';
import AddCategoryModal from './restaurant/components/CategoreForm.jsx';
import AddIngredientsModal from './restaurant/components/test.jsx';
import CreatePlatModal from './restaurant/components/formPlates.jsx';
import CommandDash from './restaurant/components/CommandDach.jsx';
import PlatDash from './restaurant/components/platDash.jsx';
import CategorieDash from './restaurant/components/categorieDich.jsx';
import IngredientsDish from './restaurant/components/ingridiantDach.jsx';
import DashboardRestaurant from './restaurant/restaurantDashbord.jsx';
import TableModal from './restaurant/components/formTable.jsx';
import TableDash from './restaurant/components/TableDach.jsx';
import ReservationDash from './restaurant/components/ReservationDach.jsx';
import AperçuStats from './restaurant/components/Statisitque.jsx';
import CommandesPageLivr from './restaurant/mesCommandeLivr.jsx';
import LivreurDash from './restaurant/livreurDach.jsx';
import VideoCall from './restaurant/vedioStrem.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/Livreur" element={<LivreurDash />} />
        <Route path="/commandes" element={<CommandDash />} />
        <Route path="/reservations" element={<ReservationDash />} />
        <Route path="/plats" element={<PlatDash />} />
        <Route path="/ingredients" element={<IngredientsDish />} />
        <Route path="/categories" element={<CategorieDash />} />
        <Route path="/table" element={<TableDash />} />
        <Route path="/Dachboard/Restaurants" element={<AperçuStats />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<BonAppetitDashboard />} />
        <Route path="/get" element={<GetUsers/>} />
        <Route path="/RestaurantManagement" element={<RestaurantManagement/>} />
        <Route path="/menu/:restaurant_id/table/:table_id" element={<RestaurantMenuClient/>} />
        <Route path="/menu/:restaurant_id" element={<RestaurantMenuUser/>} />
        <Route path="/Restaurants" element={<RestaurantsPage/>} />
        <Route path="/Reservation" element={<ReservationsPage />} />
        <Route path="/Profile" element={<UserProfile />} />
        <Route path="/BonAppetitCategories" element={<BonAppetitCategories/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/Commandes/:restaurant_id/table/:table_id" element={<CommandesPage />} />
        <Route path="/Livraisons/:restaurant_id" element={<CommandesPageLivr />} />
        <Route path="/BonAppetitDashboard" element={<BonAppetitDashboards />} />
        <Route path="*"lement={<Page404 />} />

      </Routes>
    </Router>
  );
}

export default App;
