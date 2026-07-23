import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'featured', label: 'Featured Cards' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
      <ul className="sidebar-nav">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setIsOpen(false);
            }}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
