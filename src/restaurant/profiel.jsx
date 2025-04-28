import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { form } from 'framer-motion/client';
import { Navigate } from 'react-router-dom';

const UserProfile = ({ id_user }) => {
  const [user, setUser] = useState({
    username: '',
    first_name: '',
    email: '',
    phone: '',
    last_password: '',
    new_password: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [id_user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/profile/${id_user}`);
      setUser({
        username: response.data.user.nom_utilisateur || '',
        first_name: response.data.user.prenom || '',
        email: response.data.user.email || '',
        phone: response.data.user.telephone || '',
        last_password: '',
        new_password: '',
        avatar: response.data.avatar || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    try {
      const updatedUser = {
        nom_utilisateur: user.username,
        prenom: user.first_name,
        email: user.email,
        telephone: user.phone,
      };
  
      if (user.last_password && user.new_password) {
        updatedUser.last_password = user.last_password;
        updatedUser.new_password = user.new_password;
      }
  
      const response = await axios.put(`http://127.0.0.1:8000/api/User/${id_user}/update-profile`, updatedUser);
  
      console.log(response);
      console.log(response.data);
  
      const message = response.data.message;
  
      Swal.fire({
        icon: 'success',
        title: 'Profil mis à jour avec succès!',
        text: message,
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {  
      window.location.reload(); 
        }, 1200);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Une erreur est survenue lors de la mise à jour du profil.';
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
        });
          if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ general: ['Une erreur est survenue.'] });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur de connexion s\'est produite. Veuillez vérifier votre réseau.',
        });
      }
    }
  };
  
  


const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/User/${id_user}`);
      
      Swal.fire({
        icon: 'success',
        title: 'Compte supprimé avec succès!',
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        sessionStorage.clear();
        window.location.href = '/';
      }, 1500); 
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de la suppression du compte.",
      });
    }
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-40">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-wood-800">Gérer Votre Profil</h1>
        <p className="text-wood-600">Mettez à jour vos informations personnelles</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Password</label>
            <input
              type="password"
              name="last_password"
              value={user.last_password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Laisser vide pour ne pas changer"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              name="new_password"
              value={user.new_password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Profil mis à jour avec succès!
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="bg-wood-500 hover:bg-wood-600 text-white font-bold py-2 px-6 rounded"
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
          >
            Supprimer le compte
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
