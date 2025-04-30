import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../components/dashboard/Sidebar';
import OrderList from '../components/dashboard/OrderList';
import PrescriptionList from '../components/dashboard/PrescriptionList';
import Modal from '../components/Modal';
import OrderModal from '../components/OrderModal';
import PrescriptionUploadForm from '../components/dashboard/PrescriptionUploadForm';
import '../styles/CustomerDashboard.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import API_BASE_URL from '../api';

function CustomerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/prescriptions?customerId=${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  }, [user._id]);

  const loadSectionData = useCallback((section) => {
    switch(section) {
      case 'orders':
        fetchOrders();
        break;
      case 'prescriptions':
        fetchPrescriptions();
        break;
      default:
        fetchOrders();
    }
  }, [fetchOrders, fetchPrescriptions]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    loadSectionData(section);
    window.history.pushState(null, '', `/customer-dashboard#${section}`);
  }, [loadSectionData]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') || 'orders';
    handleSectionChange(hash);
  }, [handleSectionChange]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    fetchOrders();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const renderDashboardStats = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Orders</div>
        <div className="stat-value">{orders.length}</div>
        <div className="stat-trend trend-up">
          <i className="bi bi-arrow-up"></i>
          <span>12% from last month</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Active Orders</div>
        <div className="stat-value">
          {orders.filter(order => ['pending', 'processing'].includes(order.status)).length}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Prescriptions</div>
        <div className="stat-value">{prescriptions.length}</div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return (
          <>
            <div className="dashboard-welcome">
              <h1 className="welcome-heading">Welcome back, {user.name}!</h1>
              <p className="welcome-subtitle">Track your orders and prescriptions</p>
            </div>
            {renderDashboardStats()}
            <div className="content-grid">
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Recent Orders</h2>
                </div>
                {isLoading ? (
                  <div className="loader">Loading...</div>
                ) : (
                  <OrderList 
                    orders={orders} 
                    isCustomer={true}
                    onViewDetails={handleViewOrder} 
                  />
                )}
              </div>
              
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Order Status</h2>
                </div>
                {/* Add order status summary/chart here */}
              </div>
            </div>
          </>
        );
      case 'prescriptions':
        return (
          <>
            <div className="dashboard-header">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Prescriptions</h1>
              </div>
              <button 
                className="btn btn-primary px-4 py-2 rounded-lg"
                onClick={() => setShowUploadModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Upload Prescription
              </button>
            </div>
            <div className="dashboard-content">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <PrescriptionList 
                  prescriptions={prescriptions} 
                  isCustomer={true}
                  onRefresh={fetchPrescriptions}
                />
              )}
            </div>
            {showUploadModal && (
              <Modal 
                isOpen={showUploadModal} 
                onClose={() => setShowUploadModal(false)}
                title="Upload Prescription"
              >
                <PrescriptionUploadForm 
                  onClose={() => setShowUploadModal(false)}
                  onSuccess={() => {
                    fetchPrescriptions();
                    setShowUploadModal(false);
                  }}
                />
              </Modal>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <button 
        className="mobile-sidebar-toggle d-lg-none"
        onClick={toggleSidebar}
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      <div 
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      <Sidebar 
        type="customer" 
        onSectionChange={(section) => {
          handleSectionChange(section);
          closeSidebar();
        }}
        className={sidebarOpen ? 'show' : ''}
        menuItems={[
          {
            title: 'Orders',
            icon: 'bi bi-cart3',
            id: 'orders'
          },
          {
            title: 'Prescriptions',
            icon: 'bi bi-file-medical',
            id: 'prescriptions'
          }
        ]}
      />
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default CustomerDashboard;
