import React, { useState } from 'react';
import Modal from './Modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../../api';

function PrescriptionList({ prescriptions = [], isVendor = false, onRefresh }) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [review, setReview] = useState('');
  const [showReviewViewModal, setShowReviewViewModal] = useState(false);

  const handleView = (prescription) => {
    console.log(`Prescription viewed - ID: ${prescription._id}, Status: ${prescription.status}`);
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

  const handleReviewClick = (prescription) => {
    console.log(`Review initiated for prescription - ID: ${prescription._id}`);
    setSelectedPrescription(prescription);
    setShowReviewModal(true);
  };

  const handleViewReview = (prescription) => {
    if (prescription.status !== 'reviewed') {
      console.log(`Attempted to view unreviewed prescription - ID: ${prescription._id}`);
      toast.info('This prescription has not been reviewed yet');
      return;
    }
    console.log(`Review viewed for prescription - ID: ${prescription._id}`);
    setSelectedPrescription(prescription);
    setShowReviewViewModal(true);
  };

  const handleReviewSubmit = async () => {
    console.log(`Submitting review for prescription - ID: ${selectedPrescription._id}`);
    if (!selectedPrescription?._id) {
      toast.error('Invalid prescription selected');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/prescriptions/${selectedPrescription._id}/review`,
        { review: review.trim() }
      );
  
      console.log('Review submission successful:', response.data);
      toast.success('Review submitted successfully');
      setShowReviewModal(false);
      setReview('');
      // Refresh the prescriptions list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  // Update badge display logic
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      reviewed: 'bg-success'
    };
    return badges[status] || 'bg-secondary';
  };

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-file-earmark-medical text-muted display-4 d-block mb-2"></i>
        <p className="text-muted">No prescriptions found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="d-none d-lg-block">
        <div className="table-responsive">
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Prescription ID</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(prescription => (
                <tr key={prescription._id}>
                  <td>#{prescription._id.slice(-6)}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{prescription.customerName}</span>
                      <span className="customer-email">{prescription.customerEmail}</span>
                    </div>
                  </td>
                  <td>{prescription.description || 'No description'}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {isVendor ? (
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleReviewClick(prescription)}
                        >
                          Review
                        </button>
                      ) : (
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => prescription.status === 'reviewed' 
                            ? handleViewReview(prescription)
                            : handleView(prescription)
                          }
                        >
                          {prescription.status === 'reviewed' ? 'View Review' : 'View'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="d-lg-none">
        <div className="order-cards">
          {prescriptions.map(prescription => (
            <div key={prescription._id} className="order-card">
              <div className="order-meta">
                <span className={`status-badge ${getStatusBadge(prescription.status)}`}>
                  {prescription.status}
                </span>
                <span className="order-time">
                  <i className="bi bi-clock me-1"></i>
                  {new Date(prescription.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
    
              <div className="order-main-info">
                <div className="order-id">#{prescription._id.slice(-6)}</div>
                <div className="order-date">
                  <i className="bi bi-calendar3 me-1"></i>
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </div>
              </div>
    
              {isVendor && (
                <div className="customer-info">
                  <div className="customer-name">{prescription.customerName}</div>
                  <div className="customer-email">{prescription.customerEmail}</div>
                </div>
              )}
    
              <div className="prescription-content">
                <div className="prescription-description">
                  {prescription.description || 'No description provided'}
                </div>
              </div>
    
              <div className="order-footer">
                <div className="action-buttons">
                  {isVendor ? (
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => handleReviewClick(prescription)}
                    >
                      <i className="bi bi-clipboard-check me-2"></i>
                      Review Prescription
                    </button>
                  ) : (
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => prescription.status === 'reviewed' 
                        ? handleViewReview(prescription)
                        : handleView(prescription)
                      }
                    >
                      <i className="bi bi-eye me-2"></i>
                      {prescription.status === 'reviewed' ? 'View Review' : 'View Prescription'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Prescription"
      >
        {selectedPrescription && (
          <div className="prescription-image">
            <img 
              src={`${API_BASE_URL}${selectedPrescription.documentUrl}`}
              alt="Prescription"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write Review"
      >
        {selectedPrescription && (
          <div>
            {/* Show prescription image at the top of the modal */}
            <div className="prescription-image mb-4">
              <img
                src={`${API_BASE_URL}${selectedPrescription.documentUrl}`}
                alt="Prescription"
                style={{
                  width: '100%',
                  maxHeight: '40vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}
              />
            </div>
            <div className="review-form">
              <div className="mb-3">
                <label className="form-label">Review Comments</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review comments here..."
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleReviewSubmit}
                  disabled={!review.trim()}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showReviewViewModal}
        onClose={() => setShowReviewViewModal(false)}
        title="Prescription Review"
      >
        {selectedPrescription && (
          <div className="review-details">
            <div className="prescription-info mb-4 p-3 bg-light rounded">
              <div className="d-flex justify-content-between mb-3">
                <span><strong>Prescription ID:</strong> #{selectedPrescription._id.slice(-6)}</span>
                <span><strong>Status:</strong> 
                  <span className={`badge ms-2 ${
                    selectedPrescription.status === 'reviewed' ? 'bg-success' : 'bg-warning'
                  }`}>
                    {selectedPrescription.status}
                  </span>
                </span>
              </div>
              <p className="mb-0"><strong>Submitted on:</strong> {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="review-content mb-4">
              <h6 className="text-primary mb-3">Reviews:</h6>
              <div className="review-text p-3 border rounded">
                {selectedPrescription.review}
              </div>
              {selectedPrescription.reviewedAt && (
                <small className="text-muted d-block mt-2">
                  Reviewed on: {new Date(selectedPrescription.reviewedAt).toLocaleDateString()}
                </small>
              )}
            </div>

            <div className="prescription-image mt-4">
              <h6 className="text-primary mb-3">Your Prescription:</h6>
              <img 
                src={`${API_BASE_URL}${selectedPrescription.documentUrl}`}
                alt="Prescription"
                style={{
                  width: '100%',
                  maxHeight: '40vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default PrescriptionList;
