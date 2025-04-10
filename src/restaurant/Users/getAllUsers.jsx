import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  console.log(localStorage.getItem('token'));

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }


  const handleDeleteUser = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:8000/api/User/${userId}`);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log(response);
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

const changeStatutUser = async (userId, statut) => {
    try {
        const response = await axios.put(`http://localhost:8000/api/User/${userId}/change-status`,
            { status: statut },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log(response.data);
    } catch (error) {
        console.error("Error changing user status:", error);
    }
};


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/User');
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      if (err.response && err.response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Échec du chargement des utilisateurs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section id="users" className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-wood-800">Gestion des utilisateurs</h3>
      <button onClick={fetchUsers} className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center">
        <i className='bx bx-refresh mr-2'></i> Actualiser les utilisateurs
      </button>
    </div>
  
    <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
      <div className="p-4 border-b border-wood-100 bg-wood-50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className='bx bx-filter text-wood-600'></i>
          <span className="font-medium text-wood-700">Filtrer</span>
          <select className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1">
            <option>Tous les utilisateurs</option>
            <option>Actifs</option>
            <option>Inactifs</option>
            <option>Nouveaux</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input type="text" placeholder="Rechercher un utilisateur..." className="border border-wood-200 rounded-md text-sm px-3 py-1" />
          <button className="bg-wood-100 hover:bg-wood-200 text-wood-700 px-3 py-1 rounded-md text-sm">
            Rechercher
          </button>
        </div>
      </div>
  
      {loading && <p className="text-wood-600 p-4">Chargement des données...</p>}
      {error && <p className="text-red-600 p-4">{error}</p>}
  
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-wood-200">
            <thead className="bg-wood-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase">Date d'inscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-wood-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wood-200 flex items-center justify-center">
                        <i className='bx bx-user text-wood-600'></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-wood-900">{user.name}</div>
                        <div className="text-sm text-wood-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-wood-700">{user.role.Role_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.statut === 'actif' ? 'bg-green-100 text-green-800' :
                      user.statut === 'inactif' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-wood-700">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        {user.statut === 'actif' && (
                      <button onClick={() => changeStatutUser(user.id, 'inactif')}  className="text-wood-600 hover:text-wood-900">
                        <i className='bx bx-edit'></i>
                      </button>
                        ) }
                        { user.statut === 'inactif' && (
                            <button onClick={() => changeStatutUser(user.id, 'inactif')}  className="text-wood-600 hover:text-wood-900">
                            <i className='bx bx-edit'></i>
                          </button>
                        )}
                      <button onClick={() => handleDeleteUser} className="text-red-600 hover:text-red-900">
                        <i className='bx bx-trash'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
  
  );
};

export default GetUsers;
