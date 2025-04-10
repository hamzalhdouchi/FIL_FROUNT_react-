import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BonAppetitDashboard from './restaurant/AdminDachbord'; 
import AuthPage from './restaurant/AuthResataurant';  
import GetUsers  from './restaurant/Users/getAllUsers';
import RestaurantManagement  from './restaurant/getAllRestaurant';
import BonAppetitCategories from './restaurant/categorei';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<BonAppetitDashboard />} />
        <Route path="/get" element={<GetUsers/>} />
        <Route path="/RestaurantManagement" element={<RestaurantManagement/>} />
        <Route path="/BonAppetitCategories" element={<BonAppetitCategories/>} />
      </Routes>
    </Router>
  );
}

export default App;
