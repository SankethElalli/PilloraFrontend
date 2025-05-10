import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Modal from '../components/dashboard/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';
import { PayPalButtons } from "@paypal/react-paypal-js";

const INR_TO_USD_RATE = 85.42;
const GST_RATE = 0.12;

function convertInrToUsd(amountInInr) {
  return (Number(amountInInr) / INR_TO_USD_RATE).toFixed(2);
}

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
    paymentMethod: 'paypal'
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * GST_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // PayPal order creation and approval
  const createOrder = (data, actions) => {
    const total = calculateTotal();
    if (total <= 0) {
      toast.error("Order amount must be greater than 0");
      return;
    }
    const amountInUsd = convertInrToUsd(total);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amountInUsd
          },
          description: `Order from Pillora - ${cart.length} items`
        }
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const subtotal = calculateSubtotal();
      const gst = calculateGST();
      const total = calculateTotal();

      const orderData = {
        orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        customerId: user._id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        gst,
        totalAmount: total,
        shippingAddress: formData.address,
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        paypalDetails: {
          orderId: details.id,
          payerId: details.payer.payer_id,
          status: details.status,
          createTime: details.create_time,
          updateTime: details.update_time
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        clearCart();
        setShowSuccessModal(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        'Payment processing failed. Please try again or contact support.'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const total = calculateTotal();

    const orderData = {
      orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      customerId: user._id,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      gst,
      totalAmount: total,
      shippingAddress: formData.address,
      paymentMethod: formData.paymentMethod
    };

    if (formData.paymentMethod === 'cod') {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/orders`,
          orderData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data) {
          clearCart();
          setShowSuccessModal(true);
        }
      } catch (error) {
        toast.error('Failed to place order. Please try again.');
      }
    }
  };

  // Handle Place Order button click
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'paypal') {
      // Trigger PayPal button programmatically
      setIsPlacingOrder(true);
      // The PayPalButtons component will handle the rest
    } else {
      handleSubmit(e);
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
              <form onSubmit={handlePlaceOrder}>
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
                          value="paypal"
                          className="form-check-input"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">PayPal</label>
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
                {/* Always show Place Order button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4"
                  disabled={isPlacingOrder}
                >
                  {formData.paymentMethod === 'paypal' ? 'Pay with PayPal' : 'Place Order'}
                </button>
                {/* Render PayPalButtons but hide it, trigger programmatically */}
                {formData.paymentMethod === 'paypal' && cart.length > 0 && (
                  <div style={{ display: 'none' }}>
                    <PayPalButtons
                      forceReRender={[cart, formData]}
                      createOrder={createOrder}
                      onApprove={async (data, actions) => {
                        await onApprove(data, actions);
                        setIsPlacingOrder(false);
                      }}
                      onError={(err) => {
                        toast.error("Payment failed. Please try again.");
                        setIsPlacingOrder(false);
                      }}
                      style={{ layout: "vertical" }}
                      // Expose a ref to trigger click programmatically
                      ref={el => {
                        if (isPlacingOrder && el && el.children && el.children[0]) {
                          el.children[0].click();
                        }
                      }}
                    />
                  </div>
                )}
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
                <span>GST (12%):</span>
                <span>₹{calculateGST().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{calculateTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Order Placed Successfully!"
      >
        <div className="text-center py-4">
          <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-3">Thank You For Your Order!</h4>
          <p className="mb-4">Your order number is: <strong>{orderNumber}</strong></p>
          <p>
            You will receive an email confirmation with invoice shortly. Your order will be delivered within 24-48 hours.
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
