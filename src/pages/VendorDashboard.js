import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../components/dashboard/Sidebar';
import ProductForm from '../components/dashboard/ProductForm';
import ProductList from '../components/dashboard/ProductList';
import Modal from '../components/dashboard/Modal';
import OrderList from '../components/dashboard/OrderList';
import PrescriptionList from '../components/dashboard/PrescriptionList';
import OrderModal from '../components/OrderModal';
import '../styles/Dashboard.css';
import '../styles/Notification.css';
import API_BASE_URL from '../api';

function VendorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('products');
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/prescriptions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPrescriptions(response.data.map(prescription => ({
        ...prescription,
        customerName: prescription.customerName || 'Unknown Customer',
        customerEmail: prescription.customerEmail || 'No Email'
      })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setIsLoading(false);
    }
  }, []);

  const loadSectionData = useCallback((section) => {
    switch(section) {
      case 'products':
        fetchProducts();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'prescriptions':
        fetchPrescriptions();
        break;
      default:
        fetchProducts();
    }
  }, [fetchProducts, fetchOrders, fetchPrescriptions]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    loadSectionData(section);
    window.history.pushState(null, '', `/vendor-dashboard#${section}`);
  }, [loadSectionData]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') || 'products';
    setActiveSection(hash);
    loadSectionData(hash);
  }, [loadSectionData]);

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
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAddProduct = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/products`, product, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts([...products, response.data]);
      setShowModal(false);
      setSnackbarText('Product added successfully!');
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setSnackbarText('Failed to add product. Please try again.');
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('token');
      const { _id, ...productData } = updatedProduct;
      let response;
      try {
        response = await axios.patch(
          `${API_BASE_URL}/api/products/${_id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (patchError) {
        if (
          patchError?.response?.status === 404 ||
          (patchError?.response?.data && typeof patchError.response.data === 'string' && patchError.response.data.includes('Cannot PATCH'))
        ) {
          response = await axios.put(
            `${API_BASE_URL}/api/products/${_id}`,
            productData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } else {
          throw patchError;
        }
      }
      setProducts(products.map(p => p._id === _id ? response.data : p));
      setIsEditModalOpen(false);
      setEditProduct(null);
      setSnackbarText('Product updated successfully!');
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    } catch (error) {
      console.error('Error updating product:', error?.response?.data || error);
      setSnackbarText(
        error?.response?.data?.message
          ? `Failed to update product: ${error.response.data.message}`
          : 'Failed to update product. Please try again.'
      );
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
  };

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
      case 'products':
        return (
          <div className="section-container">
            <div className="dashboard-header">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
              </div>
              <button 
                className="btn btn-primary px-4 py-2 rounded-lg"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Product
              </button>
            </div>

            <div className="dashboard-content product-section">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="product-grid">
                  <ProductList 
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </div>
              )}
            </div>

            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Add New Product"
              horizontal
            >
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setShowModal(false)}
              />
            </Modal>
            <Modal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditProduct(null);
              }}
              title="Edit Product"
              horizontal
            >
              <ProductForm
                product={editProduct}
                onSubmit={handleUpdateProduct}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setEditProduct(null);
                }}
              />
            </Modal>
          </div>
        );
      case 'orders':
        return (
          <>
            <div className="dashboard-header">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
              </div>
            </div>
            <div className="dashboard-content">
              <OrderList 
                orders={orders} 
                onViewDetails={handleViewOrder}
              />
              {selectedOrder && (
                <OrderModal
                  order={selectedOrder}
                  isOpen={showOrderModal}
                  onClose={() => setShowOrderModal(false)}
                  onStatusUpdate={handleOrderUpdate}
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
            </div>
            <div className="dashboard-content">
              <PrescriptionList prescriptions={prescriptions} isVendor={true} />
            </div>
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
        className={`pillora-snackbar${showSnackbar ? ' show' : ''} ${snackbarType === 'error' ? ' error' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <i className={`bi ${snackbarType === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i>
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
        type="vendor" 
        onSectionChange={(section) => {
          setActiveSection(section);
          loadSectionData(section);
          closeSidebar();
        }}
        className={sidebarOpen ? 'show' : ''}
        currentSection={activeSection}
      />
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default VendorDashboard;
