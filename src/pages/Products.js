import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/Products.css';
import '../styles/ProductGrid.css'; // Use the new grid styles
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext'; // <-- Add this import
import CategoryFilterModal from '../components/CategoryFilterModal'; // Fix import path
import Modal from '../components/Modal'; // Ensure Modal is imported
import { useLocation } from 'react-router-dom';

function Products() {
  const { addToCart } = useCart();
  const { user } = useAuth(); // <-- Get user from AuthContext
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
    // Check for selected product from carousel
    if (location.state?.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let config = {};
      // Only send Authorization header if user is a vendor
      if (user && user.isVendor) {
        const token = localStorage.getItem('token');
        config.headers = { Authorization: `Bearer ${token}` };
      }
      // For customers and logged-out users, do NOT send Authorization header
      const response = await axios.get(`${API_BASE_URL}/api/products`, config);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  const filteredProducts = sortProducts(
    products.filter(product => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
  );

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('🛒 Added to cart!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <div
        className={`products-header${showHeader ? '' : ' hide-on-scroll'}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s',
          transform: showHeader ? 'translateY(0)' : 'translateY(-110%)',
          opacity: showHeader ? 1 : 0,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div className="header-content">
          <div className="container">
            <h1 className="header-title">Products</h1>
            <div className="filters-row">
              <div className="search-box">
                <div className="search-input">
                  <i className="bi bi-search search-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Search medicines..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="filter-box">
                <button 
                  className={`category-filter-btn ${selectedCategory ? 'active' : ''}`}
                  onClick={() => setShowCategoryModal(true)}
                >
                  <i className="bi bi-funnel"></i>
                  {selectedCategory || 'All Categories'}
                </button>
                <CategoryFilterModal
                  isOpen={showCategoryModal}
                  onClose={() => setShowCategoryModal(false)}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              <div className="filter-box">
                <button
                  className={`sort-filter-btn${sortBy ? ' active' : ''}`}
                  onClick={() => setShowSortModal(true)}
                  type="button"
                >
                  <i className="bi bi-arrow-down-up sort-icon"></i>
                  {sortBy === 'name'
                    ? 'Sort by Name'
                    : sortBy === 'price-low'
                    ? 'Price: Low to High'
                    : sortBy === 'price-high'
                    ? 'Price: High to Low'
                    : 'Sort'}
                </button>
                <Modal
                  isOpen={showSortModal}
                  onClose={() => setShowSortModal(false)}
                  title="Sort Products"
                >
                  <div className="sort-modal-grid">
                    <button
                      className={`sort-filter-btn${sortBy === 'name' ? ' active' : ''}`}
                      onClick={() => { setSortBy('name'); setShowSortModal(false); }}
                      type="button"
                    >
                      Sort by Name
                    </button>
                    <button
                      className={`sort-filter-btn${sortBy === 'price-low' ? ' active' : ''}`}
                      onClick={() => { setSortBy('price-low'); setShowSortModal(false); }}
                      type="button"
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`sort-filter-btn${sortBy === 'price-high' ? ' active' : ''}`}
                      onClick={() => { setSortBy('price-high'); setShowSortModal(false); }}
                      type="button"
                    >
                      Price: High to Low
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="products-grid">
          {loading ? (
            <div className="loader-container">
              <div className="loader-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product._id}
                className="product-item"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                {product.stock < 5 && (
                  <span className="product-badge">Low Stock</span>
                )}
                <div className="product-image-container">
                  <img 
                    src={product.image.startsWith('http') 
                      ? product.image 
                      : `${API_BASE_URL}${product.image}`} 
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-product.png'; // Fallback image
                    }}
                  />
                </div>
                <div className="product-details">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name" title={product.name}>
                    {product.name}
                  </div>
                  <div className="product-price">₹{product.price.toFixed(2)}</div>
                  <div className="product-vendor" style={{ fontSize: '0.9em', color: '#64748b', marginTop: 4 }}>
                    Sold by: {product.vendorId?.businessName || 'Unknown Vendor'}
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className={`modal-container${window.innerWidth >= 992 ? ' product-modal-horizontal' : ''}`}
            style={window.innerWidth < 992 ? { maxWidth: 420, width: '95%' } : undefined}
            onClick={e => e.stopPropagation()}
          >
            {/* Product name always on top */}
            <div className="modal-header" style={window.innerWidth < 992 ? { padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' } : { borderBottom: 'none', padding: '2rem 2.5rem 1rem 2.5rem', justifyContent: 'center' }}>
              <div className="modal-title" style={{ width: '100%', textAlign: 'center' }}>{selectedProduct.name}</div>
            </div>
            <div className="modal-content" style={window.innerWidth < 992 ? { padding: '1.5rem' } : { display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start', padding: '2rem 2.5rem' }}>
              {/* Image on the left */}
              <div className="product-modal-image" style={window.innerWidth < 992 ? { textAlign: 'center', marginBottom: '1rem' } : { minWidth: 240, maxWidth: 260, textAlign: 'center' }}>
                <img
                  src={selectedProduct.image.startsWith('http')
                    ? selectedProduct.image
                    : `${API_BASE_URL}${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  style={{
                    maxWidth: '220px',
                    maxHeight: '220px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    background: '#f8fafc'
                  }}
                />
              </div>
              {/* Details on the right */}
              <div style={window.innerWidth < 992 ? {} : { flex: 1, minWidth: 0 }}>
                <div className="product-category" style={{ marginBottom: 8 }}>{selectedProduct.category}</div>
                <div className="product-price" style={{ marginBottom: 12 }}>₹{selectedProduct.price.toFixed(2)}</div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Stock:</strong> {selectedProduct.stock > 0 ? `${selectedProduct.stock} available` : 'Out of stock'}
                </div>
                <div style={{ marginBottom: 16, textAlign: 'left' }}>
                  <strong>Description:</strong>
                  <div style={{ color: '#334155', marginTop: 4, textAlign: 'left' }}>
                    {selectedProduct.description}
                  </div>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(selectedProduct);
                    handleCloseModal();
                  }}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '1rem'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
