import React from 'react';
import { EventList } from '../components/Event/EventList';
import type { PlannerEvent } from '../types';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

interface ListPageProps {
  events: PlannerEvent[];
  onDelete: (id: number) => void;
  onEdit?: (event: PlannerEvent) => void;
  onRefresh: () => void;
}

export const ListPage: React.FC<ListPageProps> = ({ events, onDelete, onEdit, onRefresh }) => {
  const { isAdmin, user } = useAuth();
  
  // Filter future events and sort by date
  const futureEvents = events
    .filter(event => new Date(event.od) >= new Date())
    .sort((a, b) => a.od.getTime() - b.od.getTime());

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      alert('Iba administrátori môžu mazať udalosti.');
      return;
    }
    
    if (window.confirm('Naozaj chcete zmazať túto udalosť?')) {
      onDelete(id);
    }
  };

  const handleSignup = async (eventId: number, userId: number) => {
    try {
      await api.signupForEvent(eventId, userId);
      onRefresh();
      alert('Úspešne ste sa prihlásili na udalosť!');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Nepodarilo sa prihlásiť na udalosť.');
    }
  };

  const handleUnsignup = async (eventId: number, userId: number) => {
    try {
      await api.removeSignup(eventId, userId);
      onRefresh();
      alert('Úspešne ste sa odhlásili z udalosti!');
    } catch (error) {
      console.error('Unsignup error:', error);
      alert('Nepodarilo sa odhlásiť z udalosti.');
    }
  };

  return (
    <div className="list-page">
      <br />
      <h1>Všetky nadchádzajúce udalosti</h1>
      <EventList 
        events={futureEvents} 
        onDelete={isAdmin ? handleDelete : undefined} 
        onEdit={onEdit}
        onSignup={handleSignup}
        onUnsignup={handleUnsignup}
        showActions={isAdmin}
      />
    </div>
  );
};