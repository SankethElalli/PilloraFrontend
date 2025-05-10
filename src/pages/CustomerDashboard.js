import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../components/dashboard/Sidebar';
import OrderList from '../components/dashboard/OrderList';
import PrescriptionList from '../components/dashboard/PrescriptionList';
import Modal from '../components/Modal';
import OrderModal from '../components/OrderModal';
import PrescriptionUploadForm from '../components/dashboard/PrescriptionUploadForm';
import '../styles/Dashboard.css';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';
import '../styles/Notification.css';

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
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

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
      setSnackbarText('Failed to load orders');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
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
      setSnackbarText('Failed to load prescriptions');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
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

  // Add this useEffect for scroll-to-hide toggle button
  useEffect(() => {
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    if (!toggleBtn) return;

    function onScroll() {
      if (window.scrollY > 10) {
        toggleBtn.classList.add('hide-on-scroll');
      } else {
        toggleBtn.classList.remove('hide-on-scroll');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return (
          <>
            <div className="dashboard-header">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
              </div>
            </div>
            <div className="dashboard-content">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <OrderList 
                  orders={orders} 
                  isCustomer={true}
                  onViewDetails={handleViewOrder} 
                />
              )}
              {selectedOrder && (
                <OrderModal
                  order={selectedOrder}
                  isOpen={showOrderModal}
                  onClose={() => setShowOrderModal(false)}
                  onStatusUpdate={handleOrderUpdate}
                  isCustomer={true}
                />
              )}
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
      {/* Snackbar notification */}
      <div
        className={`pillora-snackbar${showSnackbar ? ' show' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <i className="bi bi-exclamation-triangle me-2"></i>
        {snackbarText}
      </div>
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
