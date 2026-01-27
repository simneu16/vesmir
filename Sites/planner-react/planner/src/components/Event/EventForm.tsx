import React, { useState } from 'react';
import type { PlannerEvent } from '../../types';
import './EventForm.css';

interface EventFormProps {
  selectedDate: Date;
  onSubmit: (event: Omit<PlannerEvent, 'id'>) => void;
  onCancel: () => void;
}

// Helper function to format date for datetime-local input (without timezone issues)
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const EventForm: React.FC<EventFormProps> = ({ selectedDate, onSubmit, onCancel }) => {
  // Set default time to 8:00 AM for start and 9:00 AM for end
  const defaultStartDate = new Date(selectedDate);
  defaultStartDate.setHours(8, 0, 0, 0);
  
  const defaultEndDate = new Date(selectedDate);
  defaultEndDate.setHours(9, 0, 0, 0);

  const [formData, setFormData] = useState({
    nazov: '',
    ucebna: '',
    od: formatDateTimeLocal(defaultStartDate),
    do: formatDateTimeLocal(defaultEndDate),
    kamera: false,
    redaktor: false,
    foto: false,
    zvuk: false,
    reels: false,
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Omit<PlannerEvent, 'id'> = {
      nazov: formData.nazov,
      ucebna: formData.ucebna,
      prihlasene_id: null,
      od: new Date(formData.od),
      do: new Date(formData.do),
      kamera: formData.kamera,
      redaktor: formData.redaktor,
      foto: formData.foto,
      zvuk: formData.zvuk,
      reels: formData.reels,
      link: formData.link || null,
    };

    onSubmit(eventData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nová udalosť</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="nazov">Názov udalosti *</label>
            <input
              type="text"
              id="nazov"
              name="nazov"
              value={formData.nazov}
              onChange={handleChange}
              required
              placeholder="Napr. Deň otvorených dverí"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ucebna">Učebňa *</label>
            <input
              type="text"
              id="ucebna"
              name="ucebna"
              value={formData.ucebna}
              onChange={handleChange}
              required
              placeholder="Napr. Aula, učebňa 9"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="od">Od *</label>
              <input
                type="datetime-local"
                id="od"
                name="od"
                value={formData.od}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="do">Do *</label>
              <input
                type="datetime-local"
                id="do"
                name="do"
                value={formData.do}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Požiadavky</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="kamera"
                  checked={formData.kamera}
                  onChange={handleChange}
                />
                <span>  📹 Kamera</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="redaktor"
                  checked={formData.redaktor}
                  onChange={handleChange}
                />
                <span>  🎤 Redaktor</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="foto"
                  checked={formData.foto}
                  onChange={handleChange}
                />
                <span>  📷 Foto</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="zvuk"
                  checked={formData.zvuk}
                  onChange={handleChange}
                />
                <span>  🔈 Zvuk</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="reels"
                  checked={formData.reels}
                  onChange={handleChange}
                />
                <span>  📱 Reels</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="link">Link (voliteľné)</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Zrušiť
            </button>
            <button type="submit" className="btn-submit">
              Vytvoriť udalosť
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};