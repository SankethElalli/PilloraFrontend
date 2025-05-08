import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './dashboard/Modal';
import { toast } from 'react-toastify';
import API_BASE_URL from '../api';
import '../styles/Modal.css';
import '../styles/OrderModal.css';

function OrderModal({ order, isOpen, onClose, onStatusUpdate, isCustomer = false }) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(order?.status || 'pending');
  }, [order]);

  if (!order) return null;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;
  const horizontalLayout = isDesktop;

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <span className="badge badge-paid">Paid</span>;
      case 'pending':
        return <span className="badge badge-pending">Pending</span>;
      case 'failed':
        return <span className="badge badge-failed">Failed</span>;
      default:
        return <span className="badge badge-unknown">{status}</span>;
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`${API_BASE_URL}/api/orders/${order._id}/status`, {
        status
      });
      onStatusUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/${order._id}/invoice`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="order-modal-title-group">
          <div className="order-modal-title">Order #{order.orderNumber}</div>
          <div className="order-modal-date">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      }
      horizontal={horizontalLayout}
    >
      <div className={horizontalLayout ? 'order-modal-horizontal-modal' : ''}>
        {/* LEFT: Info & Items */}
        <div className="order-modal-left">
          {/* Customer Info */}
          <div className="order-modal-section">
            <div className="order-modal-section-header">Customer</div>
            <div className="order-modal-customer-name">{order.customerName}</div>
            <div className="order-modal-customer-email">{order.customerEmail}</div>
            <div className="order-modal-customer-address">{order.shippingAddress}</div>
          </div>
          {/* Items */}
          <div className="order-modal-section">
            <div className="order-modal-section-header">Items</div>
            <div>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-modal-item">
                  <div className="order-modal-item-name">
                    <span className="order-modal-item-text">{item.name}</span>
                    <span className="order-modal-item-quantity">× {item.quantity}</span>
                  </div>
                  <span className="order-modal-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-modal-total-row">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Status, Payment, Actions */}
        <div className="order-modal-right">
          {/* Order Status */}
          <div className="order-modal-section-header">Order Status</div>
          {isCustomer ? (
            <div className="order-modal-status-row">
              <span
                className={`badge ${
                  status === 'pending'
                    ? 'bg-warning'
                    : status === 'processing'
                    ? 'bg-info'
                    : status === 'shipped'
                    ? 'bg-primary'
                    : status === 'delivered'
                    ? 'bg-success'
                    : 'bg-danger'
                } order-modal-status-badge`}
              >
                {status}
              </span>
              <span className="order-modal-status-updated">
                Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
              </span>
            </div>
          ) : (
            <div>
              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={isLoading || status === order.status}
              >
                {isLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          )}

          {/* Payment Info */}
          <div className="order-modal-section order-modal-payment-section">
            <div className="order-modal-section-header">Payment</div>
            <div className="order-modal-payment-row">
              <span>Status:</span>
              {getPaymentStatusBadge(order.paymentStatus || 'pending')}
            </div>
            <div className="order-modal-payment-row">
              <span>Method:</span>
              <span className="order-modal-payment-method">
                {order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OrderModal;
