import React from 'react';
import { EventList } from '../components/Event/EventList';
import type { PlannerEvent } from '../types';

interface HistoryPageProps {
  events: PlannerEvent[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ events }) => {
  // Filter past events and sort by date (newest first)
  const pastEvents = events
    .filter(event => new Date(event.do) < new Date())
    .sort((a, b) => b.od.getTime() - a.od.getTime());

  return (
    <div className="history-page">
      <br />
      <h1>História udalostí</h1>
      {pastEvents.length === 0 ? (
        <p className="no-events">Žiadne minulé udalosti</p>
      ) : (
        <EventList events={pastEvents} showActions={false} />
      )}
    </div>
  );
};