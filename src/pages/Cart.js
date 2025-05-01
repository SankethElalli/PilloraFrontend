import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/CartProduct.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleRemoveFromCart = (productId, productName) => {
    removeFromCart(productId);
    toast.error(`🗑️ Removed ${productName} from cart`);
  };

  const handleUpdateQuantity = (productId, quantity, productName) => {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    updateQuantity(productId, newQuantity);
    toast.info(`Updated ${productName} quantity`);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Cart</h2>
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
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-meta">₹{item.price} × {item.quantity}</div>
                  <div className="cart-item-price">₹{item.price}</div>
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
                <div className="cart-item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
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
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-primary w-100" 
                disabled={cart.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
