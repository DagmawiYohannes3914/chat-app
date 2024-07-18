import React, { useState, useEffect, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MessageContext } from '../contexts/MessageContext';

const Chat = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const { messages, addMessage } = useContext(MessageContext);

  const { sendMessage } = useWebSocket(`ws://localhost:8000/ws/chat/${userId}/`, {
    onOpen: () => console.log('WebSocket connection established'),
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      addMessage(data.message);
    },
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/messages/?user=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        response.data.forEach((msg) => addMessage(msg));
        // addMessage(response.data)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setChatUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchMessages();
    fetchUser();
  }, [userId, addMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const newMessage = { content: message, sender: localStorage.getItem('user_id'), receiver: userId };
    sendMessage(JSON.stringify({ message: newMessage }));
    setMessage('');

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post('http://localhost:8000/api/messages/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
      } catch (error) {
        console.error('File upload failed:', error);
      }
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-700">Chat with {chatUser?.username}</h1>
        <div className="mb-6 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 mb-2 ${msg.sender === localStorage.getItem('user_id') ? 'bg-blue-100 text-right' : 'bg-gray-100'} rounded`}>
              {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button type="submit" className="bg-yellow-500 text-white p-2 rounded">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
