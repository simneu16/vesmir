import React from 'react';
import { getMonthDays, isSameDay } from '../../utils/dateHelpers';
import type { PlannerEvent } from '../../types';

interface CalendarGridProps {
  currentDate: Date;
  events: PlannerEvent[];
  onDayClick: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onDayClick,
}) => {
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const weekDays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.od), date)
    );
  };

  return (
    <div className="calendar-grid">
      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                isToday ? 'today' : ''
              }`}
              onClick={() => onDayClick(day)}
            >
              <span className="day-number">{day.getDate()}</span>
              {dayEvents.length > 0 && (
                <div className="event-indicators">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="event-dot"
                      title={event.nazov}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="more-events">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};