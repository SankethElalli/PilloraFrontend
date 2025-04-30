import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './dashboard/Modal';
import { toast } from 'react-toastify';
import API_BASE_URL from '../api';

function OrderModal({ order, isOpen, onClose, onStatusUpdate, isCustomer = false, horizontal }) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStatus(order?.status || 'pending');
  }, [order]);

  if (!order) return null;

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

  // Responsive horizontal layout for desktop
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;
  const horizontalLayout = horizontal && isDesktop;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      horizontal={horizontal}
    >
      <div className={horizontalLayout ? 'order-modal-horizontal-modal' : ''}>
        {/* Left: Customer & Items */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#1e293b', marginBottom: 8 }}>
              Order #{order.orderNumber}
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Customer</div>
            <div style={{ fontSize: 15, color: '#0f172a', marginBottom: 4 }}>{order.customerName}</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>{order.customerEmail}</div>
            <div style={{ fontSize: 14, color: '#64748b' }}>{order.shippingAddress}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Items</div>
            <div>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 15,
                    marginBottom: 8,
                  }}
                >
                  <span>
                    {item.name} <span style={{ color: '#64748b' }}>× {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{item.price * item.quantity}</span>
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

          {/* Download Invoice button */}
          <div className="mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={handleDownloadInvoice}
            >
              <i className="bi bi-download me-2"></i>
              Download Invoice
            </button>
          </div>
        </div>
        
        {/* Right: Status and Actions */}
        <div
          style={
            horizontalLayout
              ? {
                  flex: 1,
                  padding: '2.5rem 2.5rem 2rem 2rem',
                  borderTopRightRadius: 18,
                  borderBottomRightRadius: 18,
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  minWidth: 0,
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
