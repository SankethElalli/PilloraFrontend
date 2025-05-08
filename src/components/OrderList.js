import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ProductGrid.css';

function OrderList({ orders = [], isCustomer = false, onViewDetails }) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredOrders = isCustomer && user && user.email
    ? orders.filter(order => order.customerEmail === user.email)
    : orders;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-inbox text-muted display-4 d-block mb-2"></i>
        <p className="text-muted">No orders found</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="order-cards">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-meta">
              <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
              <span className="order-time">
                <i className="bi bi-clock me-1"></i>
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="order-main-info">
              <div className="order-id">#{order.orderNumber}</div>
              <div className="order-date">
                <i className="bi bi-calendar3 me-1"></i>
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="order-items-section">
              <div className="products-grid">
                {order.items.map((item, idx) => (
                  <div key={idx} className="product-item">
                    <div className="product-image-container">
                      {item.productId?.image ? (
                        <img
                          src={item.productId.image}
                          alt={item.name}
                          className="product-img"
                        />
                      ) : (
                        <div className="product-img-placeholder">
                          <i className="bi bi-box-seam"></i>
                        </div>
                      )}
                    </div>
                    <div className="product-details">
                      <h5 className="product-name">{item.name}</h5>
                      <div className="product-info">
                        <span className="quantity">Qty: {item.quantity}</span>
                        <span className="price">₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-footer">
              <div className="price-info">
                <span className="total-label">Total Amount</span>
                <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary view-details-btn"
                onClick={() => onViewDetails(order)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            {!isCustomer && <th>Customer</th>}
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            {!isCustomer && <th>Payment</th>}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order._id}>
              <td>{order.orderNumber}</td>
              {!isCustomer && (
                <td>
                  <div>{order.customerName}</div>
                  <small className="text-muted">{order.customerEmail}</small>
                </td>
              )}
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <ul className="list-unstyled">
                  {order.items.map((item, i) => (
                    <li key={i} className="d-flex align-items-center mb-2">
                      {item.productId?.image && (
                        <img
                          src={item.productId.image}
                          alt={item.name}
                          className="me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div>{item.quantity} × {item.name}</div>
                        <small className="text-muted">₹{item.price.toFixed(2)} each</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </td>
              <td>₹{order.totalAmount.toFixed(2)}</td>
              {!isCustomer && (
                <td>
                  <span className={
                    "badge " +
                    (order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
                      ? 'badge-paid'
                      : order.paymentStatus === 'failed'
                      ? 'badge-failed'
                      : 'badge-pending')
                  }>
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                  </span>
                </td>
              )}
              <td>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
                <div className="text-muted small mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onViewDetails && onViewDetails(order)}
                  title={isCustomer ? "View Order Details" : "Manage Order"}
                >
                  {isCustomer ? "View Details" : "Manage Order"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
