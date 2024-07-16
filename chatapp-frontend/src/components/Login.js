import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        username,
        password,
      });
      console.log('Login response:', response.data);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Fetch user details with the token
      // const userResponse = await axios.get('http://localhost:8000/api/accounts/users/me/', {
      //       headers: {
      //           Authorization: `Bearer ${response.data.access}`,
      //       },
      //   });
      //    console.log('User response:', userResponse.data);

      // Store user ID in localStorage
      localStorage.setItem('user_id', response.data.id);

      // Redirect to chat page or home page
      navigate('/home');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-700">Login</h1>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
