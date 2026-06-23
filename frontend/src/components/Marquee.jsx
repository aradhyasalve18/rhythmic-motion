import React from 'react';
import './Marquee.css';

export default function Marquee({ text, speed = '20s', reverse = false }) {
  const items = Array(8).fill(text);
  
  return (
    <div className="marquee-container">
      <div 
        className={`marquee-track ${reverse ? 'reverse' : ''}`}
        style={{ '--marquee-speed': speed }}
      >
        {items.map((item, index) => (
          <span key={index} className="marquee-item">
            {item} <span className="marquee-divider">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
