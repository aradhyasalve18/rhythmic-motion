import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-nav">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
