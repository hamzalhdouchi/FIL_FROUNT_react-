import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CategoryModal from "./CategoreForm";
import UpdateCategoryModal from "./categoreiUpdateForme";
import { Link, useNavigate } from "react-router-dom";
import HeaderDach from "./layout/headerDach";
import UserProfile from "../profiel";

const CategorieDash = () => {
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const menu = JSON.parse(sessionStorage.getItem('menu'));
  console.log(menu);
  
const menu_id = menu[0].id;

  const fetchCategorie = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categories/${menu_id}`,);

      setCategorie(response.data); 
      console.log(response);
      
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorie();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement cette catégorie.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/categories/${id}`);
        setCategorie((prev) => prev.filter((cat) => cat.id !== id));
        Swal.fire({
          title: "Supprimé !",
          text: "La catégorie a été supprimée avec succès.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        Swal.fire({
          title: "Erreur",
          text: "Une erreur est survenue lors de la suppression.",
          icon: "error",
        });
      }
    }
  };


  const handleEditClick = (categorie) => {
    setSelectedCategorie(categorie);
    setShowUpdateModal(true);
  };

  const filteredCategorie = categorie.filter((cat) =>
    cat.mon_categorie.toLowerCase().includes(search.toLowerCase())
  );


    
       useEffect(() => {
                  const token = sessionStorage.getItem("token");
                  const userData = JSON.parse(sessionStorage.getItem("user"));
                  if (userData) {
                      const role = userData.role_id;
                      if (role !== 2) {
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
   
  
    const handleLogout = () => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      navigate('/');
    };


  return (
    <>
    <div className="bg-wood-50">
    <div className="min-h-screen flex">
      <aside className={`w-64 bg-wood-800 text-white fixed h-full z-10  md:block`}>
        <div className="p-4 border-b border-wood-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
              <i className="bx bx-restaurant text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
              <p className="text-xs text-wood-300">Gestion Restaurant</p>
            </div>
          </div>
        </div>

     
        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
        
          <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-receipt text-xl mr-3"></i>
            <span>Gestion des Commandes</span>
          </Link>
          <Link to="/reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-calendar-check text-xl mr-3"></i>
            <span>Gestion des Réservations</span>
          </Link>
          <Link to="/plats" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-bowl-hot text-xl mr-3"></i>
            <span>Gestion des Plats</span>
          </Link>
          <Link to="/ingredients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-basket text-xl mr-3"></i>
            <span>Gestion des Ingrédients</span>
          </Link>
          <Link to="/categories" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
          <i className="bx bxs-category text-xl mr-3"></i>
          <span>Gestion des Categories</span>
          </Link>
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bx-chair text-xl mr-3"></i>
          <span>Gestion des Table</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
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
              className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors w-full text-left"
            >
              <i className='bx bx-log-out text-xl mr-3'></i>
              <span>Logout</span>
            </button>
        </div>
      </aside>

      <div className={`fixed inset-0 bg-black bg-opacity-50 -z-30`}>
        <div className="bg-wood-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-300 -translate-x-full">
          <div className="p-4 border-b border-wood-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-wood-600 flex items-center justify-center">
                <i className="bx bx-restaurant text-xl"></i>
              </div>
              <h1 className="font-bold text-lg brand-text">Serve Quick</h1>
            </div>
            
          </div>

       <nav className="mt-6">
          <div className="px-4 mb-2 text-xs uppercase text-wood-400 font-semibold">Principal</div>
        
          <Link to="/commandes" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-receipt text-xl mr-3"></i>
            <span>Gestion des Commandes</span>
          </Link>
          <Link to="/reservations" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-calendar-check text-xl mr-3"></i>
            <span>Gestion des Réservations</span>
          </Link>
          <Link to="/plats" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-bowl-hot text-xl mr-3"></i>
            <span>Gestion des Plats</span>
          </Link>
          <Link to="/ingredients" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-basket text-xl mr-3"></i>
            <span>Gestion des Ingrédients</span>
          </Link>
          <Link to="/categories" className="flex items-center px-4 py-3 text-wood-100 bg-wood-700">
          <i className="bx bxs-category text-xl mr-3"></i>
          <span>Gestion des Categories</span>
          </Link>
          <Link to="/table" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
          <i className="bx bx-chair text-xl mr-3"></i>
          <span>Gestion des Table</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs uppercase text-wood-400 font-semibold">Paramètres</div>
          <Link to="/profile" className="flex items-center px-4 py-3 text-wood-300 hover:text-white hover:bg-wood-700 transition-colors">
            <i className="bx bxs-user-circle text-xl mr-3"></i>
            <span>Profil</span>
          </Link>
        </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        <HeaderDach />
    <section id="categorie" className="m-8">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-wood-800">Gestion des ingrédients</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-wood-600 hover:bg-wood-700 text-white px-4 py-2 rounded-lg flex items-center btn-text"
        >
          <i className="bx bx-plus mr-2"></i> Ajouter un Categories
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-wood-100 overflow-hidden">
        <div className="p-4 border-b border-wood-100 bg-wood-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="border border-wood-200 rounded-md text-sm px-3 py-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-wood-600">Chargement...</div>
          ) : filteredCategorie.length === 0 ? (
            <div className="p-6 text-center text-wood-600">Aucune catégorie trouvée</div>
          ) : (
            <table className="min-w-full divide-y divide-wood-200">
              <thead className="bg-wood-50">
                <tr>

                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">#id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-wood-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-wood-200">
                {filteredCategorie.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4 text-sm font-medium text-wood-900">{cat.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-wood-900">{cat.mon_categorie}</td>
                    <td className="px-6 py-4 text-sm text-wood-700 max-w-xs truncate">{cat.description}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditClick(cat)}>
                          <i className="bx bx-edit"></i>
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CategoryModal
          closeModal={() => setShowCreateModal(false)}
          fetchdata={fetchCategorie}    
        />
      )}

    {showUpdateModal && selectedCategorie && (
    <UpdateCategoryModal
        closeModal={() => setShowUpdateModal(false)} 
        category={selectedCategorie}
        fetchdata={fetchCategorie}
    />
    )}
    </section>
        </div>
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
  </>
  );
};

export default CategorieDash;
