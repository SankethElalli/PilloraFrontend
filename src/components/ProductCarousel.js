import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import '../styles/ProductCarousel.css';
import { useNavigate } from 'react-router-dom';

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [productsPerSlide, setProductsPerSlide] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [modalProduct, setModalProduct] = useState(null);
  const touchStartX = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      if (mobile) {
        setProductsPerSlide(1);
      } else if (window.innerWidth <= 900) {
        setProductsPerSlide(2);
      } else if (window.innerWidth <= 1200) {
        setProductsPerSlide(3);
      } else {
        setProductsPerSlide(4);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getVisibleProducts = () => {
    const start = currentIndex;
    return products.slice(start, start + productsPerSlide);
  };

  const nextSlide = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + productsPerSlide;
        return nextIndex >= products.length ? 0 : nextIndex;
      });
      setIsFading(false);
    }, 350);
  }, [products.length, productsPerSlide]);

  const prevSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex - productsPerSlide;
        return nextIndex < 0 ? Math.max(0, products.length - productsPerSlide) : nextIndex;
      });
      setIsFading(false);
    }, 350);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 40) prevSlide();
    else if (diff < -40) nextSlide();
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!loading && products.length > productsPerSlide) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [loading, products.length, nextSlide, productsPerSlide]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <section className="product-carousel-section py-5">
      <div className="container">
        <h2 className="text-center mb-5">Featured Products</h2>
        <div className={`pillora-carousel-outer${isMobile ? ' mobile-marquee' : ''}`}>
          {/* Desktop carousel */}
          {!isMobile && (
            <>
              <button 
                className="pillora-carousel-arrow left" 
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <div className={`pillora-carousel-track${isFading ? ' fade-out' : ' fade-in'}`}>
                {getVisibleProducts().map((product) => (
                  <div
                    key={product._id}
                    className="pillora-carousel-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setModalProduct(product)}
                  >
                    <div className="carousel-product-image">
                      <img
                        src={product.image.startsWith('http')
                          ? product.image
                          : `${API_BASE_URL}${product.image}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-product.png';
                        }}
                      />
                    </div>
                    <h4>{product.name}</h4>
                    <p className="price">₹{product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <button 
                className="pillora-carousel-arrow right" 
                onClick={nextSlide}
                disabled={currentIndex + productsPerSlide >= products.length}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          {/* Mobile marquee carousel */}
          {isMobile && (
            <div className="pillora-carousel-marquee-wrapper">
              <div className="pillora-carousel-marquee-track" style={{ width: `${products.length * 210}px` }}>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="pillora-carousel-card mobile-marquee"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setModalProduct(product)}
                  >
                    <div className="carousel-product-image">
                      <img
                        src={product.image.startsWith('http')
                          ? product.image
                          : `${API_BASE_URL}${product.image}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-product.png';
                        }}
                      />
                    </div>
                    <h4>{product.name}</h4>
                    <p className="price">₹{product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Product Details Modal */}
        {modalProduct && (
          <div className="modal-overlay" onClick={() => setModalProduct(null)}>
            <div
              className={`modal-container${window.innerWidth >= 992 ? ' product-modal-horizontal' : ''}`}
              style={window.innerWidth < 992 ? { maxWidth: 420, width: '95%' } : undefined}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header" style={window.innerWidth < 992 ? { padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' } : { borderBottom: 'none', padding: '2rem 2.5rem 1rem 2.5rem', justifyContent: 'center' }}>
                <div className="modal-title" style={{ width: '100%', textAlign: 'center' }}>{modalProduct.name}</div>
                <button className="modal-close" onClick={() => setModalProduct(null)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', fontSize: 20 }}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-content" style={window.innerWidth < 992 ? { padding: '1.5rem' } : { display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '2rem 2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: window.innerWidth < 992 ? 'column' : 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
                  <div className="product-modal-image" style={window.innerWidth < 992 ? { textAlign: 'center', marginBottom: '1rem' } : { minWidth: 240, maxWidth: 260, textAlign: 'center' }}>
                    <img
                      src={modalProduct.image.startsWith('http')
                        ? modalProduct.image
                        : `${API_BASE_URL}${modalProduct.image}`}
                      alt={modalProduct.name}
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
                    <div className="product-category" style={{ marginBottom: 8 }}>{modalProduct.category}</div>
                    <div className="product-price" style={{ marginBottom: 12 }}>₹{modalProduct.price.toFixed(2)}</div>
                    <div style={{ marginBottom: 12 }}>
                      <strong>Stock:</strong> {modalProduct.stock > 0 ? `${modalProduct.stock} available` : 'Out of stock'}
                    </div>
                    <div style={{ marginBottom: 16, textAlign: 'left' }}>
                      <strong>Description:</strong>
                      <div style={{ color: '#334155', marginTop: 4, textAlign: 'left' }}>
                        {modalProduct.description}
                      </div>
                    </div>
                    {/* Buy Now Button */}
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => {
                        navigate('/products', { state: { selectedProduct: modalProduct } });
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCarousel;
