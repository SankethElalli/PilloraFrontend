import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CartProduct.css';
import '../styles/Notification.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // Snackbar state
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  // GST rate (12%)
  const GST_RATE = 0.12;

  const handleRemoveFromCart = (productId, productName) => {
    removeFromCart(productId);
    setSnackbarText(`Removed "${productName}" from cart`);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleUpdateQuantity = (productId, quantity, productName) => {
    // Ensure quantity is a valid number and at least 1
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    updateQuantity(productId, newQuantity);
    setSnackbarText(`Updated "${productName}" quantity`);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleClearCart = () => {
    clearCart();
    setSnackbarText('Cleared all products from cart');
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * GST_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="empty-cart-message">
          <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
          <h2 className="mb-4">Your cart is empty</h2>
          <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
        {/* Snackbar notification */}
        <div
          className={`pillora-snackbar${showSnackbar ? ' show' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <i className="bi bi-cart-x me-2"></i>
          {snackbarText}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Snackbar notification */}
      <div
        className={`pillora-snackbar${showSnackbar ? ' show' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <i className="bi bi-cart-check me-2"></i>
        {snackbarText}
      </div>
      {/* Removed Cart title and top clear button */}
      <div className="row">
        <div className="col-lg-8">
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item._id} className="cart-item-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/default-product.png';
                  }}
                />
                <div className="cart-item-details">
                  <div className="cart-item-header d-flex justify-content-between align-items-center mb-2">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="cart-item-qty-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.name)}
                      disabled={item.quantity <= 1}
                      tabIndex={-1}
                    >-</button>
                    <input
                      type="number"
                      className="cart-item-qty-input"
                      value={item.quantity}
                      onChange={e => handleUpdateQuantity(item._id, e.target.value, item.name)}
                      onBlur={e => {
                        if (!e.target.value || parseInt(e.target.value) < 1) {
                          handleUpdateQuantity(item._id, 1, item.name);
                        }
                      }}
                      min="1"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.name)}
                      tabIndex={-1}
                    >+</button>
                    <button
                      className="cart-item-remove-btn"
                      onClick={() => handleRemoveFromCart(item._id, item.name)}
                      title="Remove"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal ({cart.length} items):</span>
                <span className="fw-bold">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>GST (12%):</span>
                <span className="fw-bold">₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-primary w-100" 
                disabled={cart.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              {/* Clear Cart button inside the card, after checkout */}
              <button
                className="btn btn-outline-danger w-100 mt-3"
                onClick={handleClearCart}
                disabled={cart.length === 0}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
