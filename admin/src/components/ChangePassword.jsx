import React, { useState } from 'react';
import api from '../utils/api';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      setMessage(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div style={{ maxWidth: '450px' }}>
      <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Change Password</h2>
      
      {message && <div style={{ background: '#1a3a1a', color: '#4ade80', padding: '12px', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ background: '#3a1a1a', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', color: '#aaa', marginBottom: '6px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
            style={{ width: '100%', padding: '12px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: '#aaa', marginBottom: '6px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
            style={{ width: '100%', padding: '12px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: '#aaa', marginBottom: '6px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
            style={{ width: '100%', padding: '12px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
        </div>
        <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #c6a87c, #a0845c)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
