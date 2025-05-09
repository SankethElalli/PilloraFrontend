import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/ProductReviews.css';
import API_BASE_URL from '../api';

function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/api/reviews`,
        { productId, rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div className="rating-summary">
          <span className="average-rating">{averageRating}</span>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi bi-star${star <= Math.round(averageRating) ? '-fill' : ''}`}
              />
            ))}
            <span className="review-count">({reviews.length})</span>
          </div>
        </div>
        {user && !showReviewForm && (
          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={star <= rating ? 'active' : ''}
              >
                <i className="bi bi-star-fill" />
              </button>
            ))}
          </div>
          <textarea
            className="form-control mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
            rows="3"
          />
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="review-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <span className="reviewer-name">
                {review.customerName}
                {review.verifiedPurchase && (
                  <span className="verified-badge">
                    <i className="bi bi-patch-check-fill" />
                    Verified Purchase
                  </span>
                )}
              </span>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi bi-star${star <= review.rating ? '-fill' : ''}`}
                />
              ))}
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
