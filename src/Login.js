import React, { useState, useEffect } from 'react';
import { db, auth, provider } from './firebaseConfig';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { Link, Navigate } from 'react-router-dom'; 
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import './App.css';

const Login = ({ setUserDetails, setUserDocId }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirectHome, setRedirectHome] = useState(false);
  const [userDataDetails, setUserDataDetails] = useState(null);
  const [userDataDocId, setUserDataDocId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.email); // Fetch user data if user is authenticated
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDataFromSnapshot = querySnapshot.docs[0].data();
        const docId = querySnapshot.docs[0].id;
        setUserDetails(userDataFromSnapshot);
        setUserDocId(docId); // Set the user document ID
        setUserDataDetails(userDataFromSnapshot); // Save user details in component state
        setUserDataDocId(docId); // Save user doc ID in component state

        // Redirect to home or another page after login
        setRedirectHome(true);
      } else {
        console.log('User data not found in users collection for email:', email);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      fetchUserData(user.email);
      alert('Login successful');
    } catch (error) {
      console.error('Error during login: ', error);
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        alert('Invalid email or password. Please check your credentials.');
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setCurrentUser(user);
        setIsNewUser(true);
      } else {
        const userDataFromSnapshot = querySnapshot.docs[0].data();
        const docId = querySnapshot.docs[0].id;
        setUserDetails(userDataFromSnapshot);
        setUserDocId(docId);
        setUserDataDetails(userDataFromSnapshot); // Save user details in component state
        setUserDataDocId(docId); // Save user doc ID in component state
        alert('User already exists, logging you in.');

        // Redirect to home or another page after login
        setRedirectHome(true);
      }
    } catch (error) {
      console.error('Error during Google sign-in: ', error);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        email: currentUser.email,
        username,
        password: newPassword,
      });
      alert('User data saved successfully');
      setIsNewUser(false);
      setCurrentUser(null);
      setUsername('');
      setNewPassword('');

      // Redirect to home or another page after saving user data
      setRedirectHome(true);
    } catch (error) {
      console.error('Error saving user data: ', error);
    }
  };

  if (redirectHome) {
    return <Navigate to="/home" />;
  }

  return (
    <div>
      <h2>Login</h2>
      {!isNewUser ? (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
      ) : (
        <form onSubmit={handleUsernameSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
      <p>Don't have an account? <Link to="/">Sign up</Link></p>
    </div>
  );
};

export default Login;
