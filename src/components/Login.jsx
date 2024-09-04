import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import 'daisyui/dist/full.css'; 
import { FaUser, FaLock } from 'react-icons/fa'; 
import logo from '../assets/Cognizn_logo.webp'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:3000/api/chat/login', {
        username,
        password,
      });
  
      if (response.status === 200) {
        const { token, userid } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userid', userid);
        onLogin(token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 justify-center items-center p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8 border border-gray-300">
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-auto rounded-full shadow-lg"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <label className="flex items-center border border-gray-300 rounded-lg bg-gray-100 p-3">
              <FaUser className="text-gray-600 mr-3" size={24} />
              <input
                type="text"
                className="flex-1 p-2 border-none outline-none bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="flex items-center border border-gray-300 rounded-lg bg-gray-100 p-3">
              <FaLock className="text-gray-600 mr-3" size={24} />
              <input
                type="password"
                className="flex-1 p-2 border-none outline-none bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 flex items-center justify-center relative shadow-lg transform hover:scale-105"
            disabled={loading}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <span className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>Login</span>
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
