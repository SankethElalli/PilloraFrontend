import React, { useState } from 'react';
import OrderModal from './OrderModal';
import '../styles/OrderList.css';

function OrderList({ orders, onOrdersUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table order-list-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="order-list-cell">{order.orderNumber}</td>
                <td className="order-list-cell">{order.customerName}</td>
                <td className="order-list-cell">₹{order.totalAmount}</td>
                <td className="order-list-cell">
                  <span className={`badge bg-${getStatusColor(order.status)} order-list-status`}>
                    {order.status}
                  </span>
                </td>
                <td className="order-list-cell">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="order-list-cell">
                  <button 
                    className="btn btn-sm btn-outline-primary order-list-button"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderModal
        order={selectedOrder}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={onOrdersUpdate}
      />
    </>
  );
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
};

export default OrderList;