import React, { useState, useEffect } from 'react';
import { db, auth, provider } from './firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import './App.css';

const Login = ({ setUserDetails, setUserDocId }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [greeting, setGreeting] = useState(''); // Store greeting message
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLoginError('Please provide both email and password.');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      fetchUserData(user.email);
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
      setLoginError('Invalid email or password.');
    } else if (error.code === 'auth/user-not-found') {
      setLoginError('User not found.');
    } else {
      setLoginError('An unexpected error occurred. Please try again later.');
    }
    console.error('Error during login:', error);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      fetchUserData(user.email);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      handleLoginError(error);
    }
  };

  // Fetch user data and determine redirection
  const fetchUserData = async (email) => {
    try {
      const adminRef = collection(db, 'admin');
      const usersRef = collection(db, 'users');

      const adminQuery = query(adminRef, where('email', '==', email));
      const usersQuery = query(usersRef, where('email', '==', email));

      const [adminSnapshot, userSnapshot] = await Promise.all([getDocs(adminQuery), getDocs(usersQuery)]);

      if (!adminSnapshot.empty) {
        const adminData = adminSnapshot.docs[0].data();
        setUserDetails(adminData);
        setUserDocId(adminSnapshot.docs[0].id);
        setGreeting('Hey Admin!');
        setIsLoggedIn(true);
        navigate('/admin'); // Redirect to admin page
      } else if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setUserDetails(userData);
        setUserDocId(userSnapshot.docs[0].id);
        setGreeting('Hey User!');
        setIsLoggedIn(true);
        navigate('/home'); // Redirect to home page
      } else {
        setLoginError('No account found for this email.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit">Login</button>
            {loginError && <p className="error">{loginError}</p>}
          </form>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
          <p>Don't have an account? <Link to="/">Sign up</Link></p>
        </>
      ) : (
        <div>
          <h1>{greeting}</h1>
          <p>Redirecting you to your dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
