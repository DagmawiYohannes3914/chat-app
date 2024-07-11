import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewMessage = () => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/', {
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
    if (recipient) {
      // Establish WebSocket connection when a recipient is selected
      socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${recipient}/`);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data.message);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Clean up the WebSocket connection when the component unmounts or recipient changes
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [recipient]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/messages/', {
        receiver: recipient,
        content: message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log(response.data);
      
      // Send message through WebSocket
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify({ message }));
      }
      
      navigate(`/chat/${recipient}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-700">New Message</h1>
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <label className="block text-gray-700">Select Recipient</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="" disabled>Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded mt-4">Send</button>
        </form>
      </div>
    </div>
  );
};

export default NewMessage;
