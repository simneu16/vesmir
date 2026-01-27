import React, { useState } from 'react';
import { BottomNavbar } from './components/Navbar/BottomNavbar';
import { CalendarPage } from './pages/CalendarPage';
import { ListPage } from './pages/ListPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';
import { EventForm } from './components/Event/EventForm';
import { AuthForm } from './components/Auth/AuthForm';
import { useEvents } from './hooks/useEvents';
import { useAuth } from './hooks/useAuth';
import type { PlannerEvent } from './types';
import './styles/App.css';

function App() {
  const { user, loading: authLoading, error: authError, login, register, logout, isAuthenticated, isAdmin } = useAuth();
  const { events, loading, error, deleteEvent, addEvent, refreshEvents } = useEvents();
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'history' | 'admin'>('calendar');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleCreateEvent = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleSubmitEvent = async (eventData: Omit<PlannerEvent, 'id'>) => {
    try {
      await addEvent(eventData);
      setShowEventForm(false);
      alert('Udalosť bola úspešne vytvorená!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Nepodarilo sa vytvoriť udalosť. Skúste to znova.');
    }
  };

  const handleCancelForm = () => {
    setShowEventForm(false);
  };

  // Show auth form if not authenticated
  if (authLoading) {
    return <div className="loading">Načítavam...</div>;
  }

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} onRegister={register} error={authError} />;
  }

  if (loading) {
    return <div className="loading">Načítavam udalosti...</div>;
  }

  if (error) {
    return <div className="error">Chyba: {error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img
            className = "app-logo"
            src="/logo.png"
            alt="ssostaTV Logo"
            style={{ height: '6vh', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              👤 {user?.name}
            </span>
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Odhlásiť sa
            </button>
          </div>
        </div>
      </header>

      <div className="app-content">
        {activeTab === 'calendar' && (
          <CalendarPage
            events={events}
            onCreateEvent={handleCreateEvent}
            onRefresh={refreshEvents}
          />
        )}

        {activeTab === 'list' && (
          <ListPage events={events} onDelete={deleteEvent} onRefresh={refreshEvents} />
        )}

        {activeTab === 'history' && (
          <HistoryPage events={events} />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminPage />
        )}
      </div>

      <BottomNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
      />

      {showEventForm && (
        <EventForm
          selectedDate={selectedDate}
          onSubmit={handleSubmitEvent}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App;