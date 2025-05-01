import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../api';
import '../../styles/Modal.css';

function PrescriptionUploadForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('description', description);
    formData.append('userId', user._id);
    formData.append('customerName', user.name || 'Unknown Customer');
    formData.append('customerEmail', user.email || 'No Email');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/prescriptions/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Prescription uploaded successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="prescription-form">
      <div className="form-group">
        <label className="form-label">Upload Prescription</label>
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <small className="text-muted">Accepted formats: PDF, JPG, JPEG, PNG</small>
      </div>

      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any notes or description about the prescription"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Uploading...
            </>
          ) : (
            'Upload Prescription'
          )}
        </button>
      </div>
    </form>
  );
}

export default PrescriptionUploadForm;
