import React, { useState } from 'react';
import api from '../utils/api';

const ImageUpload = ({ onUploadSuccess, endpoint = '/upload' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Assumes the upload API accepts a file and returns { url: '...' }
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onUploadSuccess) onUploadSuccess(response.data.data.url);
    } catch (err) {
      setError('Failed to upload image. ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span>Uploading...</span>}
      {error && <span className="error" style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};

export default ImageUpload;
