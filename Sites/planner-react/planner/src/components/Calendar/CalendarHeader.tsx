import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevious,
  onNext,
  onToday,
}) => {
  const monthYear = currentDate.toLocaleDateString('sk-SK', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="calendar-header">
      <h2>{monthYear}</h2>
      <div className="calendar-controls">
        <button onClick={onPrevious}>Predchádzajúci</button>
        <button onClick={onToday}>Dnes</button>
        <button onClick={onNext}>Nasledujúci</button>
      </div>
    </div>
  );
};