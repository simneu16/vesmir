import React from 'react';
import './BottomNavbar.css';
import { CiCalendar } from "react-icons/ci";
import { IoIosList } from "react-icons/io";
import { RiHistoryFill } from "react-icons/ri";
import { FiShield } from "react-icons/fi";

interface BottomNavbarProps {
  activeTab: 'calendar' | 'list' | 'history' | 'admin';
  onTabChange: (tab: 'calendar' | 'list' | 'history' | 'admin') => void;
  isAdmin?: boolean;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ 
  activeTab, 
  onTabChange,
  isAdmin = false 
}) => {
  return (
    <nav className="bottom-navbar">
      <button
        className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => onTabChange('calendar')}
      >
        <span className="nav-icon"><CiCalendar /></span>
        <span className="nav-label">Kalendár</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => onTabChange('list')}
      >
        <span className="nav-icon"><IoIosList /></span>
        <span className="nav-label">Zoznam</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        <span className="nav-icon"><RiHistoryFill /></span>
        <span className="nav-label">História</span>
      </button>

      {isAdmin && (
        <button
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => onTabChange('admin')}
        >
          <span className="nav-icon"><FiShield /></span>
          <span className="nav-label">Admin</span>
        </button>
      )}
    </nav>
  );
};