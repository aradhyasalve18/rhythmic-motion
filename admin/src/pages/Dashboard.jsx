import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ServiceManager from '../components/ServiceManager';
import GalleryManager from '../components/GalleryManager';
import TestimonialManager from '../components/TestimonialManager';
import ChangePassword from '../components/ChangePassword';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('services');

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServiceManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'testimonials':
        return <TestimonialManager />;
      case 'settings':
        return <ChangePassword />;
      default:
        return <ServiceManager />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="logout-btn" style={{ background: '#333', color: '#ccc' }} onClick={() => setActiveTab('settings')}>⚙ Settings</button>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
