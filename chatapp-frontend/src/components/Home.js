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
        const response = await axios.get('http://localhost:8000/api/accounts/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Home</h1>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for users"
          className="w-full p-2 border border-gray-300 rounded mb-6"
        />
        <ul>
          {users.filter(user => user.username.includes(search)).map(user => (
            <li key={user.id} className="mb-4 p-4 bg-gray-100 rounded cursor-pointer" onClick={() => navigate(`/chat/${user.id}`)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
