import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';

const Admin = ({ userDetails, userDocId }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Hey Admin!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Admin;
