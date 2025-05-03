import React, { useState, useEffect } from "react";

const HeaderDach = () => {
  const [user, setUser] = useState(null); 

  const token = sessionStorage.getItem('token');

  if (!token) {
    window.location.href ='/'
  }
  useEffect(() => {
    const users = JSON.parse(sessionStorage.getItem('user'));
    if (users) {
      setUser(users);
    }
  }, []); 
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="bg-white shadow-md border-b border-wood-200 sticky top-0 z-10">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-wood-800">Tableau de Bord Restaurant</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-wood-200 flex items-center justify-center">
                <i className="bx bx-user text-xl text-wood-600"></i>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-wood-800">{user.nom_utilisateur}</p>
                <p className="text-xs text-wood-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderDach;
