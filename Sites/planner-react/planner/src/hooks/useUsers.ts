import { useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, updates: { role?: string; veduci?: boolean }) => {
    try {
      const updatedUser = await api.updateUser(id, updates);
      setUsers(users.map(u => u.id === id ? updatedUser : u));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
    refreshUsers: loadUsers,
  };
};