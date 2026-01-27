import React, { useState, useEffect } from 'react';
import { Calendar } from '../components/Calendar/Calendar';
import { DayEventsModal } from '../components/Calendar/DayEventsModal';
import { DayEventsCards } from '../components/Calendar/DayEventsCards';
import type { PlannerEvent } from '../types';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

interface CalendarPageProps {
  events: PlannerEvent[];
  onCreateEvent: (date: Date) => void;
  onRefresh: () => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ 
  events, 
  onCreateEvent,
  onRefresh 
}) => {
  const { isAdmin, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDayClick = (date: Date) => {
    if (isAdmin) {
      onCreateEvent(date);
    } else {
      setSelectedDate(date);
      if (!isMobile) {
        setShowModal(true);
      }
    }
  };

  const getEventsForDate = (date: Date): PlannerEvent[] => {
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

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="calendar-page">
      <Calendar events={events} onCreateEvent={handleDayClick} />
      
      {/* Desktop: Show modal with signup */}
      {!isMobile && showModal && selectedDate && (
        <DayEventsModal
          date={selectedDate}
          events={selectedDateEvents}
          onClose={() => setShowModal(false)}
          onSignup={handleSignup}
          onUnsignup={handleUnsignup}
        />
      )}

      {/* Mobile: Show compact cards (no signup) */}
      {isMobile && selectedDate && (
        <DayEventsCards
          date={selectedDate}
          events={selectedDateEvents}
        />
      )}
    </div>
  );
};