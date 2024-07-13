import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (search) {
        try {
          const response = await axios.get(`http://localhost:8000/api/accounts/api/search/?query=${search}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      }
    };
    fetchSearchResults();
  }, [search]);

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Home</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for users"
          className="w-full p-2 border border-gray-300 rounded mb-6"
        />
        <ul>
          {users.map(user => (
            <li key={user.id} className="mb-4 p-4 bg-gray-100 rounded cursor-pointer" onClick={() => navigate(`/chat/${user.id}`)}>
              {user.username}
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/chat/new')} className="w-full bg-purple-500 text-white p-2 rounded mt-4">Compose New Message</button>
      </div>
    </div>
  );
};

export default Home;
