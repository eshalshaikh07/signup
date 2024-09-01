import React from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = ({ userDetails, userDocId }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('You have been logged out successfully.');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out: ', error);
      alert('Failed to log out. Please try again.');
    }
  };


  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {userDetails ? (
        <div>
         
          <button onClick={handleLogout}>Logout</button>
         
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Home;
