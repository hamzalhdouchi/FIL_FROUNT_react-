import React, { useEffect, useState, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import GetUsers from './Users/getAllUsers';
import RestaurantManagement from './getAllRestaurant';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../restaurant/profiel';
import axios from 'axios';

const BonAppetitDashboard = () => {



  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
        const role = userData.role_id;
        if (role !== 4) {
           window.location.href ='/'
        }
    }
    if (!token || !userData) {
        
    window.location.href ='/'
    }else{
    if (userData) {
        setUser(userData);
    }
    }
    }, []);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const chartsRef = useRef({
    revenue: null,
    userGrowth: null,
    categories: null,
    reservations: null
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalAcceptedRestaurants: 0,
    totalRejectedRestaurants: 0
  });
  console.log(showProfile);

  
  console.log(user);
  
  const token = sessionStorage.getItem('token');
 
       

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


    const [userCounts, setUserCounts] = useState([]);
    const [labels, setLabels] = useState([]);
    const chartRef = useRef(null);
  
    useEffect(() => {
      const fetchUserCounts = async () => {
        try {
          const response = await axios.get('/api/statistiques/users-per-day');  
          setUserCounts(response.data.user_counts);
          setLabels(response.data.labels);
        } catch (error) {
          console.error("Error fetching user counts:", error);
        }
      };
  
      fetchUserCounts();
    }, []);

    
  

  // useEffect(() => {
  //   initCharts();



  //   const toggleSidebar = () => {
  //     mobileSidebar.classList.remove('hidden');
  //     setTimeout(() => {
  //       mobileSidebarContent.classList.remove('-translate-x-full');
  //     }, 10);
  //   };

  //   const hideSidebar = () => {
  //     mobileSidebarContent.classList.add('-translate-x-full');
  //     setTimeout(() => {
  //       mobileSidebar.classList.add('hidden');
  //     }, 300);
  //   };

  //   if (sidebarToggle && mobileSidebar && mobileSidebarContent && closeSidebar) {
  //     sidebarToggle.addEventListener('click', toggleSidebar);
  //     closeSidebar.addEventListener('click', hideSidebar);
  //   }

  //   return () => {
  //     if (sidebarToggle && mobileSidebar && mobileSidebarContent && closeSidebar) {
  //       sidebarToggle.removeEventListener('click', toggleSidebar);
  //       closeSidebar.removeEventListener('click', hideSidebar);
  //     }
  //     Object.keys(chartsRef.current).forEach(chart => {
  //       if (chartsRef.current[chart]) {
  //         chartsRef.current[chart].destroy();
  //       }
  //     });
  //   };
  // }, [initCharts]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res1 = await axios.get('http://localhost:8000/api/statistiques/total-users');
        const res2 = await axios.get('http://localhost:8000/api/statistiques/new-users-today');
        const res3 = await axios.get('http://localhost:8000/api/statistiques/total-accepted-restaurants');
        const res4 = await axios.get('http://localhost:8000/api/statistiques/total-rejected-restaurants');

        console.log(res1,res2,res3,res4);
        
        setStats({
          totalUsers: res1.data.total_users,
          newUsersToday: res2.data.new_users_today,
          totalAcceptedRestaurants: res3.data.total_accepted_restaurants,
          totalRejectedRestaurants: res4.data.total_rejected_restaurants
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);


  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      isPositive: true,
      icon: "bx bxs-user",
      iconColor: "bg-olive-100 text-olive-600"
    },
    {
      title: "Accepted Restaurants",
      value: stats.totalAcceptedRestaurants,
      isPositive: true,
      icon: "bx bxs-store-alt",
      iconColor: "bg-wood-100 text-wood-600"
    },
    {
      title: "Rejected Restaurants",
      value: stats.totalRejectedRestaurants,
      isPositive: false,
      icon: "bx bx-store-alt",
      iconColor: "bg-red-100 text-red-600"
    },
    {
      title: "New Users Today",
      value: stats.newUsersToday,
      isPositive: true,
      icon: "bx bx-user-plus",
      iconColor: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-wood-800 text-white fixed h-full z-10 hidden md:block">
        <div className="p-4 border-b border-wood-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
              <i className='bx bx-restaurant text-xl'></i>
            </div>
            <div>
              <h1 className="font-bold text-lg">Serve Quick</h1>
              <p className="text-xs text-wood-300">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Main</div>
          <a href="#dashboard" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
            <i className='bx bxs-dashboard text-xl mr-3'></i>
            <span>Dashboard</span>
          </a>
          <a href="#users" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className='bx bxs-user-account text-xl mr-3'></i>
            <span>User Management</span>
          </a>
          <a href="#restaurants" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className='bx bxs-store text-xl mr-3'></i>
            <span>Restaurant Management</span>
          </a>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Settings</div>
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors w-full text-left"
          >
            <i className='bx bxs-user-circle text-xl mr-3'></i>
            <span>Profile</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
          <button 
            onClick={handleLogout}
            className="flex items-center text-wood-300 hover:text-white w-full text-left"
          >
            <i className='bx bx-log-out text-xl mr-3'></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <div className="fixed bottom-4 right-4 md:hidden z-20">
        <button id="sidebar-toggle" className="bg-wood-700 text-white p-3 rounded-full shadow-lg">
          <i className='bx bx-menu text-2xl'></i>
        </button>
      </div>
      
      <div id="mobile-sidebar" className="fixed inset-0 bg-black bg-opacity-50 z-30 hidden">
        <div className="bg-wood-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-300 -translate-x-full" id="mobile-sidebar-content">
          <div className="p-4 border-b border-wood-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                <i className='bx bx-restaurant text-xl'></i>
              </div>
              <h1 className="font-bold text-lg">Serve Quick</h1>
            </div>
            <button id="close-sidebar" className="text-wood-300 hover:text-white">
              <i className='bx bx-x text-2xl'></i>
            </button>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Main</div>
            <a href="#users" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bxs-user-account text-xl mr-3'></i>
              <span>User Management</span>
            </a>
            <a href="#restaurants" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bxs-store text-xl mr-3'></i>
              <span>Restaurant Management</span>
            </a>
        x

            <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Settings</div>
            <button 
              onClick={() => {
                setShowProfile(true);
                document.getElementById('close-sidebar').click();
              }}
              className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors w-full text-left"
            >
              <i className='bx bxs-user-circle text-xl mr-3'></i>
              <span>Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors w-full text-left"
            >
              <i className='bx bx-log-out text-xl mr-3'></i>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-md border-b border-wood-200 sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-3">
              <button className="md:hidden text-wood-600">
                <i className='bx bx-menu text-2xl'></i>
              </button>
              <h2 className="text-xl font-bold text-wood-800">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-wood-200 flex items-center justify-center">
                  <i className='bx bx-user text-xl text-wood-600'></i>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-wood-800">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-wood-500">{user?.email || 'admin@bonappetit.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main id="stat" className="p-6">
          <section className="mb-8">
            <h3 className="text-xl font-bold text-wood-800 mb-4">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-wood-700">{card.title}</h4>
            <div className={`w-12 h-12 rounded-full ${card.iconColor} flex items-center justify-center`}>
              <i className={`${card.icon} text-2xl`}></i>
            </div>
          </div>
          <p className="text-3xl font-bold text-wood-900 mb-1">{card.value}</p>
          <div className="flex items-center text-sm">
            <span className={`${card.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              <i className={`bx bx-${card.isPositive ? 'up' : 'down'}-arrow-alt`}></i> {card.change}
            </span>
            <span className="text-wood-500 ml-2">Since last month</span>
          </div>
        </div>
      ))}
            </div>
          </section>
        
          <GetUsers />
          <RestaurantManagement />

        </main>
        
        <footer className="bg-white border-t border-wood-200 py-4 px-6 text-center text-wood-600 text-sm">
          <p>© {new Date().getFullYear()} Serve Quick Admin Dashboard. All rights reserved.</p>
        </footer>
      </div>

      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-[50vw] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold text-wood-800">User Profile</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="text-wood-600 hover:text-wood-800 text-2xl"
              >
                &times;
              </button>
            </div>
            <UserProfile id_user={user.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BonAppetitDashboard;