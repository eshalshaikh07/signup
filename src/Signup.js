import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userRef = collection(db, 'users');
      const emailQuery = query(userRef, where('email', '==', formData.email));
      const usernameQuery = query(userRef, where('username', '==', formData.username));
      const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery)
      ]);

      if (!emailSnapshot.empty) {
        setError('Email already exists');
        return;
      }

      if (!usernameSnapshot.empty) {
        setError('Username already exists');
        return;
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await addDoc(userRef, {
        uid: userCredential.user.uid,
        username: formData.username,
        email: formData.email,
      });

      alert('User successfully registered');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirm: '',
      });
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;
