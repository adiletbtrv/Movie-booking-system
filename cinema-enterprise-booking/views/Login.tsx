
import React, { useState } from 'react';
import { User, Role } from '../types';
import { Film, Lock, Loader } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      
      const { token, role } = response;
      
      if (token) {
        localStorage.setItem('token', token);
        
        const user: User = {
          id: username, 
          name: username,
          email: username, 
          role: role as Role || Role.USER
        };
        
        onLogin(user);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://picsum.photos/seed/cinema-auth/1920/1080')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-cinema-900/90 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-cinema-800 border border-cinema-700 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-cinema-accent rounded-2xl flex items-center justify-center shadow-lg shadow-cinema-accent/30">
                <Film size={32} className="text-white" />
            </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Sign in to book tickets</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-cinema-900 border border-cinema-700 rounded-xl px-4 py-3 focus:border-cinema-accent focus:outline-none"
                    placeholder="Enter your username"
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-cinema-900 border border-cinema-700 rounded-xl px-4 py-3 focus:border-cinema-accent focus:outline-none"
                        placeholder="••••••••"
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-cinema-accent hover:bg-rose-600 rounded-xl font-bold mt-6 shadow-lg shadow-cinema-accent/25 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading && <Loader className="animate-spin" size={20} />}
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
      </div>
    </div>
  );
}
