import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};



const UserAvatar = ({ onEditClick }) => (

    
  <div className="relative w-28 h-28">
    <div className="w-full h-full rounded-full bg-gradient-to-br from-wood-500 to-wood-700 flex items-center justify-center shadow-md">
      <i className="bx bxs-user text-white text-5xl"></i>
    </div>

    <button
      onClick={onEditClick}
      className="absolute -bottom-2 -right-2 bg-white border-2 border-white text-wood-700 hover:text-white hover:bg-wood-700 rounded-full p-2 transition"
    >
      <i className="bx bx-camera"></i>
    </button>
  </div>
);

const ProfileInfo = ({ name, email, phone, role, joinDate }) => (
  <div className="text-center md:text-left flex-1">
    <h1 className="text-2xl font-bold text-gray-800">{name || 'Utilisateur'}</h1>
    <p className="text-sm text-gray-500 mb-4">{role} • Inscrit en {joinDate}</p>
    <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
      <span className="bg-wood-100 text-wood-800 px-3 py-1 rounded-full">
        <i className="bx bx-envelope mr-1"></i>{email}
      </span>
      {phone && (
        <span className="bg-wood-100 text-wood-800 px-3 py-1 rounded-full">
          <i className="bx bx-phone mr-1"></i>{phone}
        </span>
      )}
    </div>
  </div>
);

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'personal', label: 'Informations personnelles' },
    { id: 'security', label: 'Sécurité' }
  ];

  return (
    <div className="flex gap-6 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 transition-all font-semibold ${
            activeTab === tab.id
              ? 'border-b-4 border-wood-600 text-wood-800'
              : 'text-gray-500 hover:text-wood-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const FormWrapper = ({ children }) => (
  <motion.div
    className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={fadeIn}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const PersonalInfoForm = ({ data, onChange, onSubmit }) => (
  <FormWrapper>
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Nom complet" name="name" value={data.name} onChange={onChange} />
      <Input label="Email" type="email" name="email" value={data.email} onChange={onChange} />
      <Input label="Téléphone" type="tel" name="phone" value={data.phone} onChange={onChange} />
      <div className="md:col-span-2 text-right">
        <SubmitButton label="Enregistrer" />
      </div>
    </form>
  </FormWrapper>
);

const SecurityForm = ({ data, onChange, onSubmit }) => (
  <FormWrapper>
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Mot de passe actuel" type="password" name="currentPassword" value={data.currentPassword} onChange={onChange} />
      <Input label="Nouveau mot de passe" type="password" name="newPassword" value={data.newPassword} onChange={onChange} />
      <Input label="Confirmer le mot de passe" type="password" name="confirmPassword" value={data.confirmPassword} onChange={onChange} />
      <div className="text-right">
        <SubmitButton label="Mettre à jour" />
      </div>
    </form>
  </FormWrapper>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 transition"
      required
    />
  </div>
);

const SubmitButton = ({ label }) => (
  <button
    type="submit"
    className="bg-wood-600 hover:bg-wood-700 text-white font-semibold px-6 py-2 rounded-lg transition"
  >
    {label}
  </button>
);

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalData, setPersonalData] = useState({ name: '', email: '', phone: '', role: '', joinDate: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (userData) {
      setPersonalData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'Utilisateur',
        joinDate: userData.created_at
          ? new Date(userData.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
          : 'Date inconnue'
      });
    }
  }, []);

  const handlePersonalChange = e => setPersonalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = e => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    try {
      if (activeTab === 'personal') {
        const res = await axios.put('http://127.0.0.1:8000/api/user/profile', personalData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedUser = { ...JSON.parse(sessionStorage.getItem('user')), ...res.data.user };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        Swal.fire({ icon: 'success', title: 'Profil mis à jour', timer: 1500, showConfirmButton: false });
      } else {
        await axios.put('http://127.0.0.1:8000/api/user/change-password', passwordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Mot de passe mis à jour', timer: 1500, showConfirmButton: false });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Une erreur est survenue.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-6">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
        >
          <UserAvatar onEditClick={() => {}} />
          <ProfileInfo {...personalData} />
          <button
            onClick={() => setActiveTab('personal')}
            className="bg-wood-600 hover:bg-wood-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            <i className="bx bx-edit-alt mr-2"></i> Modifier
          </button>
        </motion.div>

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'personal' ? (
            <PersonalInfoForm
              data={personalData}
              onChange={handlePersonalChange}
              onSubmit={handleSubmit}
              key="personal"
            />
          ) : (
            <SecurityForm
              data={passwordData}
              onChange={handlePasswordChange}
              onSubmit={handleSubmit}
              key="security"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
