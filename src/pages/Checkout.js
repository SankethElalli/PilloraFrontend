import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Modal from '../components/dashboard/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber] = useState(`ORD${Date.now()}${Math.floor(Math.random() * 1000)}`);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethod: 'card'
  });

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        customerId: user._id,
        customerName: formData.name,
        customerEmail: formData.email,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: calculateSubtotal(),
        shippingAddress: formData.address,
        paymentMethod: formData.paymentMethod
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      if (response.data) {
        clearCart();
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (typeof clearCart === 'function') {
      clearCart();
    }
    navigate('/customer-dashboard#orders');
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Shipping Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Delivery Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Payment Method</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          className="form-check-input"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="form-check-label">Card Payment</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          className="form-check-input"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">Cash on Delivery</label>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-4">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Order Summary</h3>
              {cart.map(item => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Subtotal:</strong>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{calculateSubtotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Order Placed Successfully!"
      >
        <div className="text-center py-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-3">Thank You For Your Order!</h4>
          <p className="mb-4">Your order number is: <strong>{orderNumber}</strong></p>
          <p className="text-muted mb-4">
            You will receive an email confirmation shortly. Your order will be delivered within 24-48 hours.
          </p>
          <button className="btn btn-primary px-4" onClick={handleModalClose}>
            Go to My Orders
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Checkout;
