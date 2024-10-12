import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
        username,
        password,
      });
      setMessage(response.data.message);
      
      const { first_name, last_name } = response.data;
      localStorage.setItem('user', JSON.stringify({ firstName: first_name, lastName: last_name }));
      localStorage.setItem('isAuthenticated', 'true');

      onLogin(first_name, last_name);
    } catch (error) {
      if (error.response && error.response.data && typeof error.response.data.detail === 'string') {
        setMessage(error.response.data.detail);
      } else if (error.response && error.response.data && Array.isArray(error.response.data.detail)) {
        setMessage(error.response.data.detail.map((err) => err.msg).join(', '));
      } else {
        setMessage('Login failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-red-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
