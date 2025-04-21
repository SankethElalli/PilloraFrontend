import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal'; // Make sure this path is correct
import API_BASE_URL from '../api';

function OrderModal({ order, isOpen, onClose, onStatusUpdate, isCustomer = false }) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`${API_BASE_URL}/api/orders/${order._id}/status`, {
        status
      });
      onStatusUpdate(response.data);
      toast.success('Order status updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.orderNumber}`}>
      <div className="order-details p-4">
        <div className="section mb-4">
          <h6 className="section-title">Customer Details</h6>
          <div className="info-box bg-light p-3 rounded">
            <p className="mb-2"><strong>Name:</strong> {order.customerName}</p>
            <p className="mb-2"><strong>Email:</strong> {order.customerEmail}</p>
            <p className="mb-0"><strong>Address:</strong> {order.shippingAddress}</p>
          </div>
        </div>

        <div className="section mb-4">
          <h6 className="section-title">Order Items</h6>
          <div className="items-box bg-light p-3 rounded">
            {order.items.map((item, index) => (
              <div key={index} className="order-item d-flex justify-content-between align-items-center">
                <span>{item.name} × {item.quantity}</span>
                <span className="price">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="order-total border-top mt-3 pt-3 d-flex justify-content-between">
              <strong>Total:</strong>
              <strong>₹{order.totalAmount}</strong>
            </div>
          </div>
        </div>

        <div className="section">
          <h6 className="section-title">Order Status</h6>
          {isCustomer ? (
            <div className="d-flex align-items-center">
              <span className={`badge ${
                status === 'pending' ? 'bg-warning' :
                status === 'processing' ? 'bg-info' :
                status === 'shipped' ? 'bg-primary' :
                status === 'delivered' ? 'bg-success' :
                'bg-danger'
              }`}>
                {status}
              </span>
              <small className="text-muted ms-2">
                Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
              </small>
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
                className="btn btn-primary w-100"
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
