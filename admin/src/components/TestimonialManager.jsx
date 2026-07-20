import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import './TestimonialManager.css';

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', text: '', rating: 5, imageUrl: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error('Error fetching testimonials', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setFormData({ clientName: item.clientName, text: item.text, rating: item.rating || 5, imageUrl: item.imageUrl || '' });
      setEditingId(item._id);
    } else {
      setFormData({ clientName: '', text: '', rating: 5, imageUrl: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      fetchTestimonials();
      closeModal();
    } catch (err) {
      console.error('Error saving testimonial', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        console.error('Error deleting testimonial', err);
      }
    }
  };

  return (
    <div className="manager-container">
      <h2>Testimonials</h2>
      <div className="list-view">
        {testimonials.map(item => (
          <div key={item._id} className="list-item">
            <div className="list-content">
              {item.imageUrl && <img src={item.imageUrl} alt={item.clientName} className="avatar" />}
              <div className="list-text">
                <h3>{item.clientName}</h3>
                <p>"{item.text}"</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>{'⭐'.repeat(item.rating || 5)}</p>
              </div>
            </div>
            <div className="card-actions">
              <button onClick={() => openModal(item)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => openModal()}>+</button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
          />
          <label>Message</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
          ></textarea>
          <label>Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            required
          />
          <label>Client Image</label>
          <ImageUpload
            onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
          />
          {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="preview-img" />}
          <button type="submit" className="submit-btn">Save</button>
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialManager;
