import { useState, useEffect } from 'react';
import type { PlannerEvent } from '../types';
import { api } from '../services/api';

export const useEvents = () => {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<PlannerEvent, 'id'>) => {
    try {
      const newEvent = await api.createEvent(event);
      setEvents([...events, newEvent]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateEvent = async (id: number, updatedEvent: Partial<PlannerEvent>) => {
    try {
      await api.updateEvent(id, updatedEvent);
      setEvents(events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await api.deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getEventsByDate = (date: Date): PlannerEvent[] => {
    return events.filter((event) => {
      const eventStart = new Date(event.od);
      eventStart.setHours(0, 0, 0, 0);
      const eventEnd = new Date(event.do);
      eventEnd.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    refreshEvents: loadEvents,
  };
};