import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import './GalleryManager.css';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: '', category: '', title: '' });

  const fetchImages = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data.data || []);
    } catch (err) {
      console.error('Error fetching gallery', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openModal = () => {
    setFormData({ imageUrl: '', category: '', title: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gallery', formData);
      fetchImages();
      closeModal();
    } catch (err) {
      console.error('Error saving image', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchImages();
      } catch (err) {
        console.error('Error deleting image', err);
      }
    }
  };

  return (
    <div className="manager-container">
      <h2>Gallery</h2>
      <div className="masonry-grid">
        {images.map(img => (
          <div key={img._id} className="masonry-item">
            <img src={img.imageUrl} alt={img.title || img.category} />
            <div className="masonry-overlay">
              <span>{img.title || img.category}</span>
              <button className="delete-btn-small" onClick={() => handleDelete(img._id)}>X</button>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={openModal}>+</button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Image">
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <label>Category / Tag</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <label>Upload Image</label>
          <ImageUpload
            onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
          />
          {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="preview-img" />}
          <button type="submit" className="submit-btn" disabled={!formData.imageUrl}>Save</button>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryManager;
