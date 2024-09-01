import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [userDocId, setUserDocId] = useState(null);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login setUserDetails={setUserDetails} setUserDocId={setUserDocId} />} />
        <Route path="/home" element={<Home userDetails={userDetails} userDocId={userDocId} />} />
     
      </Routes>
    </Router>
  );
}

export default App;
