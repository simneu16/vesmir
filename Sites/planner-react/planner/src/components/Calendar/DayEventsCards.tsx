import React from 'react';
import type { PlannerEvent } from '../../types';
import { EventCard } from '../Event/EventCard';
import { formatDate } from '../../utils/dateHelpers';
import './DayEventsCards.css';

interface DayEventsCardsProps {
  date: Date;
  events: PlannerEvent[];
}

export const DayEventsCards: React.FC<DayEventsCardsProps> = ({
  date,
  events,
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="day-events-cards">
      <h3 className="day-events-title">📅 {formatDate(date)}</h3>
      <div className="day-events-list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};