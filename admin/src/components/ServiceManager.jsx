import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import './ServiceManager.css';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', category: '', price: '', duration: '', tag: '', description: '', imageUrl: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.data || []);
    } catch (err) {
      console.error('Error fetching services', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = (service = null) => {
    if (service) {
      setFormData({ 
        name: service.name, 
        category: service.category, 
        price: service.price, 
        duration: service.duration, 
        tag: service.tag, 
        description: service.description, 
        imageUrl: service.imageUrl 
      });
      setEditingId(service._id);
    } else {
      setFormData({ name: '', category: '', price: '', duration: '', tag: '', description: '', imageUrl: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', category: '', price: '', duration: '', tag: '', description: '', imageUrl: '' });
    setEditingId(null);
  };

  const openReviewsModal = (service) => {
    setCurrentService(service);
    setIsReviewsModalOpen(true);
  };

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setCurrentService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
      } else {
        await api.post('/services', formData);
      }
      fetchServices();
      closeModal();
      alert("Package saved successfully!");
    } catch (err) {
      console.error('Error saving service', err);
      alert("Error saving: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Error deleting service', err);
      }
    }
  };

  const handleAcknowledgeReview = async (serviceId, reviewId) => {
    try {
      await api.put(`/services/${serviceId}/reviews/${reviewId}`);
      // Update local state
      const updatedService = { ...currentService };
      const reviewIndex = updatedService.reviews.findIndex(r => r._id === reviewId);
      if (reviewIndex > -1) {
        updatedService.reviews[reviewIndex].adminAcknowledged = true;
        setCurrentService(updatedService);
      }
      fetchServices();
    } catch (err) {
      console.error('Error acknowledging review', err);
    }
  };

  return (
    <div className="manager-container">
      <h2>Packages & Services</h2>
      <div className="grid">
        {services.map(service => (
          <div key={service._id} className="card">
            {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="card-img" />}
            <h3>{service.name}</h3>
            <p className="card-category">{service.category} - ${service.price}</p>
            <p>{service.description.substring(0, 100)}...</p>
            
            <div className="card-reviews-status">
              <span onClick={() => openReviewsModal(service)} style={{ cursor: 'pointer', color: 'var(--color-gold)', textDecoration: 'underline' }}>
                Reviews: {service.reviews ? service.reviews.length : 0} ({service.reviews ? service.reviews.filter(r => !r.adminAcknowledged).length : 0} new)
              </span>
            </div>

            <div className="card-actions">
              <button onClick={() => openModal(service)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(service._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => openModal()}>+</button>

      {/* Main Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Package' : 'Add Package'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Package Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          
          <label>Category</label>
          <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          
          <label>Price</label>
          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          
          <label>Image</label>
          <ImageUpload 
            onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })} 
          />
          {formData.imageUrl && (
            <div style={{ marginTop: '10px' }}>
              <img src={formData.imageUrl} alt="Preview" style={{ width: '100px', borderRadius: '8px' }} />
            </div>
          )}
          
          <label>Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          
          <button type="button" className="submit-btn" onClick={handleSubmit}>Save Package</button>
        </form>
      </Modal>

      {/* Reviews Modal */}
      <Modal isOpen={isReviewsModalOpen} onClose={closeReviewsModal} title={`Reviews for ${currentService?.name}`}>
        <div className="reviews-list">
          {currentService?.reviews?.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            currentService?.reviews?.map(review => (
              <div key={review._id} className="review-item" style={{ borderBottom: '1px solid #444', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{review.customerName} ({review.rating}/5)</strong>
                  <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: '0.5rem 0' }}>{review.text}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Contact: {review.contactInfo}</p>
                
                {review.imageUrl && (
                  <img src={review.imageUrl} alt="Review" style={{ maxWidth: '100px', borderRadius: '4px', marginTop: '0.5rem' }} />
                )}

                <div style={{ marginTop: '0.5rem' }}>
                  {review.adminAcknowledged ? (
                    <span style={{ color: 'green', fontSize: '0.9rem' }}>✓ Acknowledged</span>
                  ) : (
                    <button onClick={() => handleAcknowledgeReview(currentService._id, review._id)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                      Acknowledge Review
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ServiceManager;
