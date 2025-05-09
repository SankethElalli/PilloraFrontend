import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../api';

function ProductReviews({ productId, reviews: initialReviews = [], isModal = false }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews([response.data, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStar = (index, currentRating, isInteractive = true) => {
    const filled = index <= (isInteractive ? (hoveredRating || rating) : currentRating);
    return (
      <i 
        className={`bi ${filled ? 'bi-star-fill active' : 'bi-star'}`}
        style={{ color: filled ? '#ffd700' : '#cbd5e1' }}
      ></i>
    );
  };

  return (
    <div className={`product-reviews ${isModal ? 'modal-reviews' : ''}`}>
      <h3 className="reviews-title">
        <i className="bi bi-star-fill me-2"></i>
        Customer Reviews
      </h3>
      
      {user && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-input">
            <label className="rating-label">Your Rating:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="star"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <i className={`bi ${star <= (hoveredRating || rating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                </button>
              ))}
            </div>
          </div>
          <div className="review-input-wrapper">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
              className="review-input"
            />
          </div>
          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="bi bi-arrow-repeat spinning me-2"></i>
                Submitting...
              </>
            ) : (
              <>
                <i className="bi bi-send-fill me-2"></i>
                Submit Review
              </>
            )}
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <i className="bi bi-chat-square-text mb-2" style={{ fontSize: '2rem' }}></i>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="review-rating-group">
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="star">
                        <i className={`bi ${star <= review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                      </span>
                    ))}
                  </div>
                  <span className="review-author">
                    By {review.userId?.name || 'Anonymous'}
                  </span>
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
