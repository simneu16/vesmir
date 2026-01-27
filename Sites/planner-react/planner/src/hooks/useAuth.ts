import { useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { pushNotifications } from '../services/pushNotifications';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { user } = await api.verifyToken(token);
        setUser(user);
        
        // Register for push notifications
        await pushNotifications.register(user.id);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (nick: string, password: string) => {
    try {
      setError(null);
      const { token, user } = await api.login(nick, password);
      localStorage.setItem('token', token);
      setUser(user);
      
      // Register for push notifications
      await pushNotifications.register(user.id);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const register = async (name: string, nick: string, password: string) => {
    try {
      setError(null);
      const { token, user } = await api.register(name, nick, password);
      localStorage.setItem('token', token);
      setUser(user);
      
      // Register for push notifications
      await pushNotifications.register(user.id);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    await pushNotifications.unregister();
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};