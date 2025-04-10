import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import GetUsers from './Users/getAllUsers';
import RestaurantManagement from './getAllRestaurant'

const BonAppetitDashboard = () => {
  useEffect(() => {
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const userGrowthCtx = document.getElementById('userGrowthChart')?.getContext('2d');
    const categoriesCtx = document.getElementById('categoriesChart')?.getContext('2d');
    const reservationsCtx = document.getElementById('reservationsChart')?.getContext('2d');

    const destroyChart = (chart) => {
      if (chart) {
        chart.destroy();
      }
    };

    let revenueChart, userGrowthChart, categoriesChart, reservationsChart;

    if (revenueCtx) {
      destroyChart(revenueChart);  
      revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Revenue',
            data: [25000, 32000, 28000, 42000, 38000, 52000, 48000],
            backgroundColor: 'rgba(189, 140, 94, 0.2)',
            borderColor: 'rgba(189, 140, 94, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    if (userGrowthCtx) {
      destroyChart(userGrowthChart); 
      userGrowthChart = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'New Users',
            data: [120, 150, 180, 220, 280, 320, 350],
            backgroundColor: 'rgba(141, 156, 90, 0.2)',
            borderColor: 'rgba(141, 156, 90, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    if (categoriesCtx) {
      destroyChart(categoriesChart); 
      categoriesChart = new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Italian', 'French', 'Japanese', 'Mexican', 'Indian', 'Other'],
          datasets: [{
            data: [25, 20, 18, 15, 12, 10],
            backgroundColor: [
              'rgba(169, 115, 71, 0.8)',
              'rgba(140, 94, 59, 0.8)',
              'rgba(115, 77, 52, 0.8)',
              'rgba(95, 64, 46, 0.8)',
              'rgba(141, 156, 90, 0.8)',
              'rgba(111, 124, 67, 0.8)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    if (reservationsCtx) {
      destroyChart(reservationsChart);  
      reservationsChart = new Chart(reservationsCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Reservations',
            data: [65, 78, 82, 95, 120, 145, 132],
            backgroundColor: 'rgba(169, 115, 71, 0.7)',
            borderColor: 'rgba(169, 115, 71, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarContent = document.getElementById('mobile-sidebar-content');
    const closeSidebar = document.getElementById('close-sidebar');

    if (sidebarToggle && mobileSidebar && mobileSidebarContent && closeSidebar) {
      sidebarToggle.addEventListener('click', () => {
        mobileSidebar.classList.remove('hidden');
        setTimeout(() => {
          mobileSidebarContent.classList.remove('-translate-x-full');
        }, 10);
      });

      closeSidebar.addEventListener('click', () => {
        mobileSidebarContent.classList.add('-translate-x-full');
        setTimeout(() => {
          mobileSidebar.classList.add('hidden');
        }, 300);
      });
    }

    return () => {
      destroyChart(revenueChart);
      destroyChart(userGrowthChart);
      destroyChart(categoriesChart);
      destroyChart(reservationsChart);
    };
  }, []);

  return (
    <>
      {/* <Head>
        <title>Bon Appétit - Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    wood: {
                      50: '#faf6f2',
                      100: '#f5ede3',
                      200: '#ead9c7',
                      300: '#ddc2a5',
                      400: '#cca57d',
                      500: '#bd8c5e',
                      600: '#a97347',
                      700: '#8c5e3b',
                      800: '#734d34',
                      900: '#5f402e',
                    },
                    olive: {
                      50: '#f8f9f2',
                      100: '#eef0e2',
                      200: '#dde3c7',
                      300: '#c5cea3',
                      400: '#aab77d',
                      500: '#8d9c5a',
                      600: '#6f7c43',
                      700: '#5a6538',
                      800: '#4a5331',
                      900: '#3e462c',
                    }
                  }
                }
              }
            }
          `
        }} />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" /> */}

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-wood-800 text-white fixed h-full z-10 hidden md:block">
          <div className="p-4 border-b border-wood-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                <i className='bx bx-restaurant text-xl'></i>
              </div>
              <div>
                <h1 className="font-bold text-lg">Bon Appétit</h1>
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
            <a href="#statistics" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bxs-bar-chart-alt-2 text-xl mr-3'></i>
              <span>Statistics</span>
            </a>
            <a href="#history" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bx-history text-xl mr-3'></i>
              <span>Restaurant History</span>
            </a>
            
            <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Settings</div>
            <a href="#profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bxs-user-circle text-xl mr-3'></i>
              <span>Profile</span>
            </a>
            <a href="#settings" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
              <i className='bx bxs-cog text-xl mr-3'></i>
              <span>Settings</span>
            </a>
          </nav>
          
          <div className="absolute bottom-0 w-full p-4 border-t border-wood-700">
            <a href="#logout" className="flex items-center text-wood-300 hover:text-white">
              <i className='bx bx-log-out text-xl mr-3'></i>
              <span>Logout</span>
            </a>
          </div>
        </aside>
        
        {/* Mobile sidebar toggle */}
        <div className="fixed bottom-4 right-4 md:hidden z-20">
          <button id="sidebar-toggle" className="bg-wood-700 text-white p-3 rounded-full shadow-lg">
            <i className='bx bx-menu text-2xl'></i>
          </button>
        </div>
        
        {/* Mobile sidebar */}
        <div id="mobile-sidebar" className="fixed inset-0 bg-black bg-opacity-50 z-30 hidden">
          <div className="bg-wood-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-300 -translate-x-full" id="mobile-sidebar-content">
            <div className="p-4 border-b border-wood-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                  <i className='bx bx-restaurant text-xl'></i>
                </div>
                <h1 className="font-bold text-lg">Bon Appétit</h1>
              </div>
              <button id="close-sidebar" className="text-wood-300 hover:text-white">
                <i className='bx bx-x text-2xl'></i>
              </button>
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
              <a href="#statistics" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
                <i className='bx bxs-bar-chart-alt-2 text-xl mr-3'></i>
                <span>Statistics</span>
              </a>
              <a href="#history" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
                <i className='bx bx-history text-xl mr-3'></i>
                <span>Restaurant History</span>
              </a>
              
              <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Settings</div>
              <a href="#profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
                <i className='bx bxs-user-circle text-xl mr-3'></i>
                <span>Profile</span>
              </a>
              <a href="#settings" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
                <i className='bx bxs-cog text-xl mr-3'></i>
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <header className="bg-white shadow-md border-b border-wood-200 sticky top-0 z-10">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-3">
                <button className="md:hidden text-wood-600">
                  <i className='bx bx-menu text-2xl'></i>
                </button>
                <h2 className="text-xl font-bold text-wood-800">Dashboard</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-lg border border-wood-200 focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent" />
                  <i className='bx bx-search absolute left-3 top-2.5 text-wood-400'></i>
                </div>
                
                <button className="relative p-2 text-wood-600 hover:bg-wood-100 rounded-full">
                  <i className='bx bx-bell text-xl'></i>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-wood-200 flex items-center justify-center">
                    <i className='bx bx-user text-xl text-wood-600'></i>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-wood-800">Admin User</p>
                    <p className="text-xs text-wood-500">admin@bonappetit.com</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Dashboard content */}
          <main className="p-6">
            {/* Overview Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-wood-800 mb-4">Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-wood-700">Total Users</h4>
                    <div className="w-12 h-12 rounded-full bg-olive-100 flex items-center justify-center">
                      <i className='bx bxs-user text-2xl text-olive-600'></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-wood-900 mb-1">2,845</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 flex items-center">
                      <i className='bx bx-up-arrow-alt'></i> 12.5%
                    </span>
                    <span className="text-wood-500 ml-2">Since last month</span>
                  </div>
                </div>
                
                {/* Active Restaurants Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-wood-700">Active Restaurants</h4>
                    <div className="w-12 h-12 rounded-full bg-wood-100 flex items-center justify-center">
                      <i className='bx bxs-store-alt text-2xl text-wood-600'></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-wood-900 mb-1">128</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 flex items-center">
                      <i className='bx bx-up-arrow-alt'></i> 8.2%
                    </span>
                    <span className="text-wood-500 ml-2">Since last month</span>
                  </div>
                </div>
                
                {/* Total Revenue Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-wood-700">Total Revenue</h4>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className='bx bx-dollar-circle text-2xl text-blue-600'></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-wood-900 mb-1">$324,895</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 flex items-center">
                      <i className='bx bx-up-arrow-alt'></i> 18.3%
                    </span>
                    <span className="text-wood-500 ml-2">Since last month</span>
                  </div>
                </div>
                
                {/* New Registrations Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-wood-700">New Registrations</h4>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <i className='bx bx-user-plus text-2xl text-purple-600'></i>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-wood-900 mb-1">156</p>
                  <div className="flex items-center text-sm">
                    <span className="text-red-500 flex items-center">
                      <i className='bx bx-down-arrow-alt'></i> 3.8%
                    </span>
                    <span className="text-wood-500 ml-2">Since last month</span>
                  </div>
                </div>
              </div>
            </section>
          
            <GetUsers />

            {/* Restaurant Management Section */}
           <RestaurantManagement />
            
            {/* Statistics Section */}
            <section id="statistics" className="mb-8">
              <h3 className="text-xl font-bold text-wood-800 mb-4">Statistics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-wood-700">Revenue Overview</h4>
                    <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <canvas id="revenueChart"></canvas>
                  </div>
                </div>
                
                {/* User Growth Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-wood-700">User Growth</h4>
                    <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <canvas id="userGrowthChart"></canvas>
                  </div>
                </div>
                
                {/* Restaurant Categories Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-wood-700">Restaurant Categories</h4>
                    <button className="text-wood-600 hover:text-wood-800">
                      <i className='bx bx-dots-horizontal-rounded'></i>
                    </button>
                  </div>
                  <div className="h-80">
                    <canvas id="categoriesChart"></canvas>
                  </div>
                </div>
                
                {/* Reservations Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-wood-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-wood-700">Reservations</h4>
                    <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <canvas id="reservationsChart"></canvas>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Restaurant History Section */}
            <section id="history" className="mb-8">
              <h3 className="text-xl font-bold text-wood-800 mb-4">Restaurant History</h3>
              
              <div className="bg-white rounded-xl shadow-md border border-wood-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <i className='bx bx-filter text-wood-600'></i>
                    <span className="font-medium text-wood-700">Filter</span>
                    <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
                      <option>All Events</option>
                      <option>Registrations</option>
                      <option>Updates</option>
                      <option>Deactivations</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="date" className="border border-wood-200 rounded-md text-sm px-3 py-1" />
                    <span className="text-wood-600">to</span>
                    <input type="date" className="border border-wood-200 rounded-md text-sm px-3 py-1" />
                    <button className="bg-wood-100 hover:bg-wood-200 text-wood-700 px-3 py-1 rounded-md text-sm">
                      Apply
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-wood-200"></div>
                  
                  {/* Timeline events */}
                  <div className="space-y-8">
                    {/* Event 1 */}
                    <div className="flex">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center z-10 border-2 border-white">
                        <i className='bx bx-plus text-green-600'></i>
                      </div>
                      <div className="ml-6">
                        <div className="bg-wood-50 p-4 rounded-lg border border-wood-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-wood-800">New Restaurant Added</h5>
                              <p className="text-wood-600 text-sm mt-1">Sakura Sushi was added to the platform</p>
                            </div>
                            <span className="text-wood-500 text-xs">Today, 10:30 AM</span>
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-wood-200 flex items-center justify-center">
                              <i className='bx bx-user text-wood-600 text-sm'></i>
                            </div>
                            <span className="ml-2 text-sm text-wood-700">by Admin User</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Event 2 */}
                    <div className="flex">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10 border-2 border-white">
                        <i className='bx bx-edit text-blue-600'></i>
                      </div>
                      <div className="ml-6">
                        <div className="bg-wood-50 p-4 rounded-lg border border-wood-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-wood-800">Restaurant Updated</h5>
                              <p className="text-wood-600 text-sm mt-1">Le Bistro Parisien updated their menu and contact information</p>
                            </div>
                            <span className="text-wood-500 text-xs">Yesterday, 3:45 PM</span>
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-wood-200 flex items-center justify-center">
                              <i className='bx bx-user text-wood-600 text-sm'></i>
                            </div>
                            <span className="ml-2 text-sm text-wood-700">by Restaurant Owner</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Event 3 */}
                    <div className="flex">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center z-10 border-2 border-white">
                        <i className='bx bx-time text-yellow-600'></i>
                      </div>
                      <div className="ml-6">
                        <div className="bg-wood-50 p-4 rounded-lg border border-wood-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-wood-800">Restaurant Status Changed</h5>
                              <p className="text-wood-600 text-sm mt-1">Mama Mia Trattoria status changed to Pending</p>
                            </div>
                            <span className="text-wood-500 text-xs">Jun 12, 2023, 9:15 AM</span>
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-wood-200 flex items-center justify-center">
                              <i className='bx bx-user text-wood-600 text-sm'></i>
                            </div>
                            <span className="ml-2 text-sm text-wood-700">by System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Event 4 */}
                    <div className="flex">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center z-10 border-2 border-white">
                        <i className='bx bx-trash text-red-600'></i>
                      </div>
                      <div className="ml-6">
                        <div className="bg-wood-50 p-4 rounded-lg border border-wood-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-wood-800">Restaurant Removed</h5>
                              <p className="text-wood-600 text-sm mt-1">Golden Dragon restaurant was removed from the platform</p>
                            </div>
                            <span className="text-wood-500 text-xs">Jun 10, 2023, 2:30 PM</span>
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-wood-200 flex items-center justify-center">
                              <i className='bx bx-user text-wood-600 text-sm'></i>
                            </div>
                            <span className="ml-2 text-sm text-wood-700">by Admin User</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-wood-100 hover:bg-wood-200 text-wood-700 px-4 py-2 rounded-lg">
                    Load More History
                  </button>
                </div>
              </div>
            </section>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-wood-200 py-4 px-6 text-center text-wood-600 text-sm">
            <p>© 2025 Bon Appétit Admin Dashboard. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default BonAppetitDashboard;