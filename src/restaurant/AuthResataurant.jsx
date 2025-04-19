import { useState } from "react";
import Login from "../auth/login";
import Register from "../auth/sigin_up";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-gradient-to-br from-wood-100 to-white min-h-screen">
      <div className="min-h-screen flex flex-col md:flex-row">
        
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-wood-900/70 to-wood-800/50 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Restaurant interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center items-center p-12 text-white">
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">Serve Quick</h1>
              <p className="text-xl max-w-md text-wood-100/90">
                Welcome to our culinary experience. Sign in to explore our menu and make reservations.
              </p>
            </div>
            <div className="mt-8 flex space-x-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Fine Dining</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Reservations</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Delivery</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-wood-500 to-wood-700 flex items-center justify-center shadow-lg shadow-wood-200">
                <i className="bx bx-restaurant text-5xl text-white"></i>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-wood-900">Welcome back</h2>
              <p className="mt-2 text-wood-700">
                Sign in to your account or create a new one
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl shadow-wood-100 p-8 mb-8 border border-wood-200">
              <div className="w-full mb-8">
                <div className="grid w-full grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`py-2.5 px-4 font-medium rounded-lg ${
                      activeTab === "login" ? "bg-wood-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`py-2.5 px-4 font-medium rounded-lg ${
                      activeTab === "signup" ? "bg-wood-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {activeTab === "login" ? (
                <Login isLoading={isLoading} setIsLoading={setIsLoading} />
              ) : (
                <Register isLoading={isLoading} setIsLoading={setIsLoading} />
              )}
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-wood-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-wood-50 px-4 text-wood-500 font-medium">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-wood-200 rounded-lg font-medium text-wood-700 hover:bg-wood-50 transition-colors shadow-sm"
              >
                <i className="bx bxl-google text-xl mr-2"></i> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-wood-200 rounded-lg font-medium text-wood-700 hover:bg-wood-50 transition-colors shadow-sm"
              >
                <i className="bx bxl-facebook text-xl mr-2 text-blue-600"></i> Facebook
              </button>
            </div>
            
            <div className="mt-8 text-center text-wood-500 text-sm">
              <p>© 2025 Serve Quick. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;