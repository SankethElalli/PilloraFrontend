import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/Products.css';
import '../styles/ProductGrid.css';
import '../styles/Notification.css';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import CategoryFilterModal from '../components/CategoryFilterModal';
import Modal from '../components/Modal';
import { useLocation } from 'react-router-dom';
import ProductReviews from '../components/ProductReviews';

function Products() {
  const { addToCart } = useCart();
  const { user } = useAuth();
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
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input for better performance
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
    if (location.state?.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
      // Remove state after using it so modal doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
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
      if (user && user.isVendor) {
        const token = localStorage.getItem('token');
        config.headers = { Authorization: `Bearer ${token}` };
      }
      const response = await axios.get(`${API_BASE_URL}/api/products`, config);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optimize filtering and sorting with useMemo
  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    if (debouncedSearch) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarText(`Added "${product.name}" to cart`);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Snackbar notification */}
      <div
        className={`pillora-snackbar${showSnackbar ? ' show' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <i className="bi bi-cart-check me-2"></i>
        {snackbarText}
      </div>
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
                      e.target.src = '/default-product.png';
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
            <div className="modal-content" style={window.innerWidth < 992 ? { padding: '1.5rem' } : { display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '2rem 2.5rem' }}>
              <div style={{ display: 'flex', flexDirection: window.innerWidth < 992 ? 'column' : 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
                {/* Existing product image and details */}
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
                  {/* Share buttons */}
                  <div className="share-buttons">
                    <span className="share-label">Share:</span>
                    <button
                      className="share-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/?text=Check out ${selectedProduct.name} on Pillora: ${window.location.origin}/products?id=${selectedProduct._id}`, '_blank');
                      }}
                    >
                      <i className="bi bi-whatsapp"></i>
                    </button>
                    <button
                      className="share-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:?subject=Check out this product on Pillora&body=Check out ${selectedProduct.name} on Pillora: ${window.location.origin}/products?id=${selectedProduct._id}`;
                      }}
                    >
                      <i className="bi bi-envelope"></i>
                    </button>
                    <button
                      className="share-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}/products?id=${selectedProduct._id}`;
                        navigator.clipboard.writeText(url);
                        setSnackbarText('Link copied to clipboard!');
                        setShowSnackbar(true);
                        setTimeout(() => setShowSnackbar(false), 2000);
                      }}
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
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
              {/* Add reviews section */}
              <ProductReviews
                productId={selectedProduct._id}
                reviews={selectedProduct.reviews || []}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
