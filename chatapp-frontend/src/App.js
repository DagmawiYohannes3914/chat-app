import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Chat from './components/Chat';
import NewMessage from './components/NewMessage';
import Navbar from './components/Navbar';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated, checkAuth } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/chat/:userId" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/chat/new" element={isAuthenticated ? <NewMessage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};

export default App;
