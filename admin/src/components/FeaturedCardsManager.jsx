import React, { useState, useEffect } from 'react';
import api, { featuredAPI } from '../utils/api';
import ImageUpload from './ImageUpload';
import './FeaturedCardsManager.css';

const DEFAULT_CARDS = [
  { id: 'venues', title: 'Royal Venues', description: 'Discover majestic palaces, heritage resorts, and ultra-luxury banquets curated for grand celebrations.', imageUrl: '/images/placeholder_venue_resort.jpg', linkedCategory: 'All', order: 0 },
  { id: 'decor', title: 'Exquisite Decor', description: 'Bespoke floral arrangements, thematic mandap designs, and transformative lighting by master artisans.', imageUrl: '/images/placeholder_decor_floral.jpg', linkedCategory: 'All', order: 1 },
  { id: 'photo', title: 'Cinematic Photography', description: 'Award-winning photographers capturing your most intimate and spectacular moments in fine-art style.', imageUrl: '/images/placeholder_photo_wedding.jpg', linkedCategory: 'All', order: 2 },
  { id: 'styling', title: 'Bridal Styling', description: 'Elite makeup artists and bridal consultants to ensure you look flawless on your special day.', imageUrl: '/images/placeholder_makeup_bridal.jpg', linkedCategory: 'All', order: 3 }
];

const FeaturedCardsManager = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both featured cards and all services to get categories
      const [featuredRes, servicesRes] = await Promise.all([
        featuredAPI.getAll(),
        api.get('/services')
      ]);

      const fetchedCards = featuredRes.data.data;
      if (fetchedCards && fetchedCards.length > 0) {
        // Pad with defaults if less than 4
        let combined = [...fetchedCards];
        while (combined.length < 4) {
          combined.push(DEFAULT_CARDS[combined.length]);
        }
        setCards(combined.slice(0, 4));
      } else {
        setCards(DEFAULT_CARDS);
      }

      // Extract unique categories from services
      const services = servicesRes.data.data || [];
      const uniqueCats = ['All', ...new Set(services.map(s => s.category))];
      setCategories(uniqueCats);

    } catch (err) {
      console.error('Error fetching data for Featured Cards:', err);
      setCards(DEFAULT_CARDS);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleSaveAll = async () => {
    try {
      const cardsToSave = cards.map((c, i) => ({ ...c, order: i }));
      await featuredAPI.updateAll(cardsToSave);
      alert('Featured cards saved successfully!');
    } catch (err) {
      console.error('Error saving featured cards', err);
      alert('Error saving: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-gold)' }}>Loading featured cards...</div>;
  }

  return (
    <div className="manager-container">
      <h2>Featured Cards (Home Page)</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        These 4 cards are displayed prominently on the Home page. Link them to specific service categories so clients can view related services directly.
      </p>

      <div className="featured-cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="featured-card-editor card">
            <h3 style={{ marginBottom: '15px', color: 'var(--gold-primary)' }}>Card {index + 1}</h3>
            
            <label>Title</label>
            <input 
              type="text" 
              value={card.title} 
              onChange={(e) => handleCardChange(index, 'title', e.target.value)} 
              placeholder="e.g. Royal Venues"
            />

            <label>Description</label>
            <textarea 
              value={card.description} 
              onChange={(e) => handleCardChange(index, 'description', e.target.value)}
              rows="3"
            />

            <label>Linked Category</label>
            <select 
              value={card.linkedCategory} 
              onChange={(e) => handleCardChange(index, 'linkedCategory', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Services (No Filter)' : cat}</option>
              ))}
            </select>

            <label>Image</label>
            <ImageUpload 
              onUploadSuccess={(url) => handleCardChange(index, 'imageUrl', url)} 
            />
            {card.imageUrl && (
              <div style={{ marginTop: '10px' }}>
                <img src={card.imageUrl} alt="Preview" className="preview-img" style={{ maxHeight: '120px' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <button className="submit-btn" onClick={handleSaveAll} style={{ padding: '12px 30px', fontSize: '1.1rem' }}>
          Save All Cards
        </button>
      </div>
    </div>
  );
};

export default FeaturedCardsManager;
