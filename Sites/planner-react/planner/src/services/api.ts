import type { PlannerEvent, User, AuthResponse } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Events
  async getEvents(): Promise<PlannerEvent[]> {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.map((event: any) => ({
      ...event,
      od: new Date(event.od),
      do: new Date(event.do),
    }));
  },

  async getEvent(id: number): Promise<PlannerEvent> {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    const data = await response.json();
    return {
      ...data,
      od: new Date(data.od),
      do: new Date(data.do),
    };
  },

  async createEvent(event: Omit<PlannerEvent, 'id'>): Promise<PlannerEvent> {
    const formatDateForMySQL = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const eventData = {
      ...event,
      od: formatDateForMySQL(event.od),
      do: formatDateForMySQL(event.do),
    };

    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      throw new Error('Failed to create event');
    }
    
    return response.json();
  },

  async updateEvent(id: number, event: Partial<PlannerEvent>): Promise<PlannerEvent> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  },

  async signupForEvent(eventId: number, userId: number): Promise<void> {
    const response = await fetch(`${API_URL}/events/${eventId}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error('Failed to sign up');
  },

  async removeSignup(eventId: number, userId: number): Promise<void> {
    const response = await fetch(`${API_URL}/events/${eventId}/signup/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove signup');
  },

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async updateUser(id: number, updates: { role?: string; veduci?: boolean }): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  // Auth
  async register(name: string, nick: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, nick, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  async login(nick: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  async verifyToken(token: string): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return response.json();
  },
};