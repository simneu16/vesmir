import React, { useState } from 'react';
import type { PlannerEvent, CalendarDay } from '../../types';

interface CalendarProps {
  events: PlannerEvent[];
  onCreateEvent: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onCreateEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(date),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    return days;
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    onCreateEvent(day.date);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];
  const weekDays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <div className="calendar-controls">
          <button onClick={handlePrevMonth}>← Predošlý</button>
          <button onClick={handleToday}>Dnes</button>
          <button onClick={handleNextMonth}>Nasledujúci →</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.isToday ? 'today' : ''} ${
                !day.isCurrentMonth ? 'other-month' : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              <div className="day-number">{day.date.getDate()}</div>
              {day.events.length > 0 && (
                <div className="event-indicators">
                  {day.events.slice(0, 3).map((event) => (
                    <div key={event.id} className="event-dot" />
                  ))}
                  {day.events.length > 3 && (
                    <span className="more-events">+{day.events.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};