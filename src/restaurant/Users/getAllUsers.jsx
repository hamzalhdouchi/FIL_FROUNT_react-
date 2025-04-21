import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../components/Pagination';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 

  const token = sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/api/User', {
        params: {
          page,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,       
        },
      });

      setUsers(response.data.data);
      setLinks(response.data.links);
      setCurrentPage(page); 
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError(err.response?.data?.message || 'Échec du chargement des utilisateurs.');

      if (err.response?.status === 401) {
        Swal.fire({
          title: 'Session expirée',
          text: 'Votre session a expiré. Veuillez vous reconnecter.',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const changeStatutUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/User/${userId}/change-status`, {
        statut: newStatus,
      });
      
      Swal.fire('Succès', response.data.message, 'success');
      fetchUsers(currentPage); 
    } catch (error) {
      Swal.fire('Erreur', error.response?.data?.message || 'Échec du changement de statut.', 'error');
    }
  };

  const deleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
        
        Swal.fire({
          title: 'Supprimé !',
          text: 'L\'utilisateur a été supprimé.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        
        fetchUsers(currentPage); 
      } catch (error) {
        Swal.fire('Erreur', error.response?.data?.message || 'Impossible de supprimer cet utilisateur.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []); 

  const handlePageChange = (url) => {
    if (!url) return;

    const page = new URL(url).searchParams.get('page');
    fetchUsers(page); 
  };

  

  return (
    <section id="users" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-wood-800">Gestion des utilisateurs</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => fetchUsers(currentPage)} 
            className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className='bx bx-refresh mr-2'></i> Actualiser
          </button>
        </div>
      </div>
    
      <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
        {/* Barre de filtres et recherche */}
        <div className="p-4 border-b border-wood-100 bg-wood-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <i className='bx bx-filter text-wood-600'></i>
              <span className="font-medium text-wood-700">Filtrer</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-wood-200 rounded-md text-wood-700 text-sm px-2 py-1"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">livreur</option>
                <option value="restaurateur">Restaurateurs</option>
                <option value="client">Clients</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Rechercher un utilisateur..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-wood-200 rounded-md text-sm px-3 py-1 pl-8 w-full"
              />
              <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-wood-400'></i>
            </div>
          </div>
        </div>
      
        {/* Gestion des états de chargement et erreurs */}
        {loading && (
          <div className="p-4 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood-600"></div>
            <span className="ml-2 text-wood-600">Chargement des données...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md mx-4 mt-4">
            <i className='bx bx-error-circle mr-2'></i> {error}
          </div>
        )}
      
        {/* Tableau des utilisateurs */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-wood-200">
                <thead className="bg-wood-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Date d'inscription</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-wood-200">
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-wood-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wood-200 flex items-center justify-center">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <i className='bx bx-user text-wood-600'></i>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-wood-900">{user.name}</div>
                              <div className="text-sm text-wood-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-wood-700 capitalize">
                            {user.role?.Role_name || 'Non défini'}
                          </div>
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
                          {new Date(user.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => changeStatutUser(user.id, user.statut)} 
                              className="text-wood-600 hover:text-wood-900 transition-colors"
                              title="Changer le statut"
                            >
                              <i className='bx bx-toggle-left text-xl'></i>
                            </button>
                            

                            <button 
                              onClick={() => deleteUser(user.id)} 
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Supprimer"
                            >
                              <i className='bx bx-trash text-xl'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-wood-500">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='mb-2'>
            <Pagination links={links} onPageChange={handlePageChange} /> {/* Utilisation de Pagination */}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default GetUsers;
