import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './dashboard/Modal';
import { toast } from 'react-toastify';
import API_BASE_URL from '../api';
import '../styles/Modal.css';  // Add this import

function OrderModal({ order, isOpen, onClose, onStatusUpdate, isCustomer = false }) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(order?.status || 'pending');
  }, [order]);

  if (!order) return null;

  // Responsive horizontal layout for desktop only
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;
  const horizontalLayout = isDesktop;

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

      // Create blob link to download
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1e293b', textAlign: 'left' }}>
            Order #{order.orderNumber}
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      }
      horizontal={horizontalLayout}
    >
      <div className={horizontalLayout ? 'order-modal-horizontal-modal' : ''}>
        <div
          style={
            horizontalLayout
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto', // Changed from minHeight: 400
                  maxHeight: '80vh',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem', // Added padding
                }
              : {}
          }
        >
          {/* Top: Order Info */}
          <div
            style={
              horizontalLayout
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginBottom: '1rem', // Added margin
                  }
                : { margin: '16px 0' }
            }
          >
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, alignSelf: 'center', textAlign: 'center' }}>Customer</div>
            <div style={{ fontSize: 15, color: '#0f172a', marginBottom: 4, textAlign: 'left' }}>{order.customerName}</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4, textAlign: 'left' }}>{order.customerEmail}</div>
            <div style={{ fontSize: 14, color: '#64748b', textAlign: 'left' }}>{order.shippingAddress}</div>
          </div>
          {/* Items section - reduced margins and padding */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Items</div>
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
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                marginTop: 16,
                paddingTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right: Status and Actions - adjusted padding */}
        <div
          style={
            horizontalLayout
              ? {
                  flex: 1,
                  padding: '1rem 1.5rem',
                  borderTopRightRadius: 18,
                  borderBottomRightRadius: 18,
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  minWidth: 0,
                  maxHeight: '80vh',
                }
              : { marginTop: 24 }
          }
        >
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Order Status</div>
          {isCustomer ? (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
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
                }`}
                style={{
                  fontSize: 15,
                  padding: '0.5rem 1.25rem',
                  borderRadius: 8,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {status}
              </span>
              <span style={{ color: '#64748b', fontSize: 13, marginLeft: 12 }}>
                Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
              </span>
            </div>
          ) : (
            <div>
              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ maxWidth: 240, marginBottom: 16 }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="btn btn-primary"
                style={{ minWidth: 160 }}
                onClick={handleStatusUpdate}
                disabled={isLoading || status === order.status}
              >
                {isLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default OrderModal;
