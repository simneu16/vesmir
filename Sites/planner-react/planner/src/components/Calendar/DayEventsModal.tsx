import React from 'react';
import type { PlannerEvent } from '../../types';
import { EventCard } from '../Event/EventCard';
import { formatDate } from '../../utils/dateHelpers';
import './DayEventsModal.css';

interface DayEventsModalProps {
  date: Date;
  events: PlannerEvent[];
  onClose: () => void;
  onSignup?: (eventId: number, userId: number) => void;
  onUnsignup?: (eventId: number, userId: number) => void;
}

export const DayEventsModal: React.FC<DayEventsModalProps> = ({
  date,
  events,
  onClose,
  onSignup,
  onUnsignup,
}) => {
  return (
    <div className="day-modal-overlay" onClick={onClose}>
      <div className="day-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="day-modal-header">
          <h2>📅 {formatDate(date)}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="day-modal-body">
          {events.length === 0 ? (
            <p className="no-events">Žiadne udalosti v tento deň</p>
          ) : (
            <div className="day-events-list">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSignup={onSignup}
                  onUnsignup={onUnsignup}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};