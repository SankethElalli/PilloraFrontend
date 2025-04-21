import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/Products.css';
import '../styles/ProductGrid.css'; // Use the new grid styles
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext'; // <-- Add this import

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
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    fetchProducts();
    // Re-fetch products when user logs in/out
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
                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Women Care">Women Care</option>
                  <option value="Baby Care">Baby Care</option>
                  <option value="Diabetes Care">Diabetes Care</option>
                  <option value="Cardiac Care">Cardiac Care</option>
                  <option value="Stomach Care">Stomach Care</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Liver Care">Liver Care</option>
                  <option value="Oral Care">Oral Care</option>
                  <option value="Respiratory">Respiratory</option>
                  <option value="Sexual Health">Sexual Health</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Cold & Immunity">Cold & Immunity</option>
                  <option value="Ayurveda">Ayurveda</option>
                  <option value="Health Devices">Health Devices</option>
                </select>
              </div>
              <div className="filter-box">
                <select 
                  className="filter-select"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="products-grid">
          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
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
            className="modal-container"
            style={{ maxWidth: 420, width: '95%' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <div className="modal-title">{selectedProduct.name}</div>
            </div>
            <div className="modal-content" style={{ padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
                    background: '#f8fafc',
                  }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/default-product.png';
                  }}
                />
              </div>
              <div className="product-category" style={{ marginBottom: 8 }}>{selectedProduct.category}</div>
              <div className="product-price" style={{ marginBottom: 12 }}>₹{selectedProduct.price.toFixed(2)}</div>
              <div style={{ marginBottom: 12 }}>
                <strong>Stock:</strong> {selectedProduct.stock > 0 ? `${selectedProduct.stock} available` : 'Out of stock'}
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>Description:</strong>
                <div style={{ color: '#334155', marginTop: 4 }}>
                  {selectedProduct.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
