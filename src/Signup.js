import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      setSignupError('Please fill in all fields.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Add user to the 'users' collection in Firestore
      const usersRef = collection(db, 'users');
      await addDoc(usersRef, {
        email: formData.email,
        name: formData.name,
      });

      navigate('/login'); // Redirect to login page after signup
    } catch (error) {
      handleSignupError(error);
    }
  };

  const handleSignupError = (error) => {
    if (error.code === 'auth/email-already-in-use') {
      setSignupError('Email is already in use.');
    } else if (error.code === 'auth/weak-password') {
      setSignupError('Password is too weak.');
    } else {
      setSignupError('An unexpected error occurred. Please try again later.');
    }
    console.error('Error during signup:', error);
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
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
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;
