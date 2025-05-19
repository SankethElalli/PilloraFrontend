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
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const [ads, setAds] = useState([]);
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adImageFile, setAdImageFile] = useState(null);
  const [adImageUploading, setAdImageUploading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

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

  const fetchAds = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/vendors/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setAds([]);
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
      case 'manage-media':
        fetchAds();
        break;
      default:
        fetchProducts();
    }
  }, [fetchProducts, fetchOrders, fetchPrescriptions, fetchAds]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    if (section === 'manage-media') {
      fetchAds();
    } else {
      loadSectionData(section);
    }
    window.history.pushState(null, '', `/vendor-dashboard#${section}`);
  }, [loadSectionData, fetchAds]);

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

  useEffect(() => {
    // Show snackbar if redirected from login
    if (location.state && location.state.snackbar) {
      setSnackbarText(location.state.snackbar);
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
      // Clear the snackbar state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  // Upload ad image file to server and get URL
  const handleAdImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAdImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/vendors/ads/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdImageUrl(res.data.url);
      setSnackbarText('Image uploaded successfully!');
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    } catch (err) {
      setSnackbarText('Failed to upload image');
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
    setAdImageUploading(false);
  };

  // Add ad (image url or link)
  const handleAddAd = async (e) => {
    e.preventDefault();
    if (!adImageUrl) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/vendors/ads`, { imageUrl: adImageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdImageUrl('');
      fetchAds();
      setSnackbarText('Ad added!');
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    } catch (err) {
      setSnackbarText('Failed to add ad');
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  // Remove ad
  const handleRemoveAd = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/vendors/ads/${adId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (err) {
      setSnackbarText('Failed to remove ad');
      setSnackbarType('error');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
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
      case 'manage-media':
        return (
          <div className="section-container">
            <div className="dashboard-header">
              <h1 className="text-2xl font-semibold text-gray-800">Manage Media</h1>
            </div>
            <div className="dashboard-content">
              <form onSubmit={handleAddAd} style={{ marginBottom: 24 }}>
                <div className="mb-3">
                  <label className="form-label">Image Link (URL)</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/your-image.jpg"
                    value={adImageUrl}
                    onChange={e => setAdImageUrl(e.target.value)}
                    disabled={adImageUploading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Or Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleAdImageUpload}
                    disabled={adImageUploading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={adImageUploading || !adImageUrl}>
                  {adImageUploading ? 'Uploading...' : 'Add Ad'}
                </button>
              </form>
              <div>
                <h5>Your Ads</h5>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {ads.length === 0 && <div>No ads yet.</div>}
                  {ads.map(ad => (
                    <div key={ad._id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, position: 'relative' }}>
                      <img src={ad.imageUrl} alt="ad" style={{ maxWidth: 180, maxHeight: 100, borderRadius: 6 }} />
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ position: 'absolute', top: 4, right: 4 }}
                        onClick={() => handleRemoveAd(ad._id)}
                        type="button"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
