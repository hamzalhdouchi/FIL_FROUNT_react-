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
const App = () => {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
