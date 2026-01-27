import React from 'react';
import { EventCard } from './EventCard';
import type { PlannerEvent } from '../../types';

interface EventListProps {
  events: PlannerEvent[];
  onDelete?: (id: number) => void;
  onEdit?: (event: PlannerEvent) => void;
  onSignup?: (eventId: number, userId: number) => void;
  onUnsignup?: (eventId: number, userId: number) => void;
  showActions?: boolean;
}

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  onDelete, 
  onEdit,
  onSignup,
  onUnsignup,
  showActions = false 
}) => {
  if (events.length === 0) {
    return (
      <div className="event-list">
        <p className="no-events">Žiadne udalosti</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <div className="events-container">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={showActions && onDelete ? onDelete : undefined}
            onEdit={onEdit}
            onSignup={onSignup}
            onUnsignup={onUnsignup}
          />
        ))}
      </div>
    </div>
  );
};