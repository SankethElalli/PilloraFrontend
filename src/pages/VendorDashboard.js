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
      // Ensure we have customer details
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
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/products/${updatedProduct._id}`, updatedProduct);
      setProducts(products.map(p => p._id === updatedProduct._id ? response.data : p));
      setIsEditModalOpen(false);
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = (productId) => {
    // TODO: Add API call to delete product
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
    // Refresh orders list to ensure we have latest data
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
