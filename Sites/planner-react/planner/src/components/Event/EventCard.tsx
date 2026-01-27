import React from 'react';
import type { PlannerEvent } from '../../types';
import { formatTime, formatDate } from '../../utils/dateHelpers';
import { useAuth } from '../../hooks/useAuth';

interface EventCardProps {
  event: PlannerEvent;
  onEdit?: (event: PlannerEvent) => void;
  onDelete?: (id: number) => void;
  onSignup?: (eventId: number, userId: number) => void;
  onUnsignup?: (eventId: number, userId: number) => void;
  compact?: boolean; // New prop for mobile compact view
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete,
  onSignup,
  onUnsignup,
  compact = false
}) => {
  const { user } = useAuth();
  
  const isSignedUp = event.signups?.some(signup => signup.id === user?.id);

  const handleSignupClick = () => {
    if (!user) return;
    
    if (isSignedUp) {
      onUnsignup?.(event.id, user.id);
    } else {
      onSignup?.(event.id, user.id);
    }
  };

  // Compact view for mobile calendar
  if (compact) {
    return (
      <div className="event-card event-card-compact">
        <div className="event-card-body">
          <h3>{event.nazov}</h3>
          <p className="event-time">
            {formatDate(event.od)} | {formatTime(event.od)} - {formatTime(event.do)}
          </p>
          <p className="event-location">📍 {event.ucebna}</p>
          
          <div className="event-requirements">
            {event.kamera && <span className="badge">📹 Kamera</span>}
            {event.redaktor && <span className="badge">🎤 Redaktor</span>}
            {event.foto && <span className="badge">📷 Foto</span>}
            {event.zvuk && <span className="badge">🔈 Zvuk</span>}
            {event.reels && <span className="badge">📱 Reels</span>}
          </div>
        </div>
      </div>
    );
  }

  // Full view for list page
  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3>{event.nazov}</h3>
      </div>
      <div className="event-card-body">
        <p className="event-time">
          {formatDate(event.od)} | {formatTime(event.od)} - {formatTime(event.do)}
        </p>
        <p className="event-location">📍 {event.ucebna}</p>
        
        <div className="event-requirements">
          {event.kamera && <span className="badge">📹 Kamera</span>}
          {event.redaktor && <span className="badge">🎤 Redaktor</span>}
          {event.foto && <span className="badge">📷 Foto</span>}
          {event.zvuk && <span className="badge">🔈 Zvuk</span>}
          {event.reels && <span className="badge">📱 Reels</span>}
        </div>

        {event.signups && event.signups.length > 0 && (
          <div className="event-signups">
            <strong>Prihlásení ({event.signups.length}):</strong>
            <div className="signup-list">
              {event.signups.map((signup) => (
                <span key={signup.id} className="signup-user">
                  {signup.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.link && (
          <p className="event-link">
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              🔗 Link
            </a>
          </p>
        )}
      </div>
      
      <div className="event-card-actions">
        {(onSignup || onUnsignup) && user && (
          <button 
            onClick={handleSignupClick}
            className={isSignedUp ? 'btn-unsignup' : 'btn-signup'}
          >
            {isSignedUp ? '✖️ Odhlásiť sa' : '✅ Prihlásiť sa'}
          </button>
        )}
        
        {onEdit && <button onClick={() => onEdit(event)}>Upraviť</button>}
        {onDelete && (
          <button onClick={() => onDelete(event.id)} className="delete-btn">
            Zmazať
          </button>
        )}
      </div>
    </div>
  );
};