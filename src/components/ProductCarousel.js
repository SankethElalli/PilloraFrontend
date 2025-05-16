import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import '../styles/ProductCarousel.css';

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [productsPerSlide, setProductsPerSlide] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [openProductId, setOpenProductId] = useState(null);
  const touchStartX = useRef(null);

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

  const handleCardClick = (productId) => {
    setOpenProductId((prev) => (prev === productId ? null : productId));
  };

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
                    onClick={() => handleCardClick(product._id)}
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
                    {openProductId === product._id && (
                      <div
                        className="carousel-product-desc"
                        style={{
                          color: "#64748b",
                          fontSize: "0.98rem",
                          marginTop: 8,
                          minHeight: 40,
                          background: "#f8fafc",
                          borderRadius: 8,
                          padding: "0.75rem 1rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                        }}
                      >
                        {product.description || "No description available."}
                      </div>
                    )}
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
                    onClick={() => handleCardClick(product._id)}
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
                    {openProductId === product._id && (
                      <div
                        className="carousel-product-desc"
                        style={{
                          color: "#64748b",
                          fontSize: "0.98rem",
                          marginTop: 8,
                          minHeight: 40,
                          background: "#f8fafc",
                          borderRadius: 8,
                          padding: "0.75rem 1rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                        }}
                      >
                        {product.description || "No description available."}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
