import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';
import '../styles/AdBanner.css';

function AdBannerCarousel() {
  const [bannerProducts, setBannerProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannerProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products?showInBanner=true`);
        setBannerProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching banner products:', error);
        setLoading(false);
      }
    };
    fetchBannerProducts();
  }, []);

  const nextSlide = useCallback(() => {
    if (currentIndex === bannerProducts.length - 1) {
      setIsResetting(true);
      setCurrentIndex(0);
    } else {
      setIsResetting(false);
      setCurrentIndex(current => current + 1);
    }
  }, [currentIndex, bannerProducts.length]);

  useEffect(() => {
    if (bannerProducts.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [bannerProducts.length, nextSlide]);

  const handleImageLoad = useCallback((productId) => {
    setImageLoaded(prev => ({
      ...prev,
      [productId]: true
    }));
  }, []);

  if (loading || bannerProducts.length === 0) {
    return null;
  }

  return (
    <div className="ad-banner-container">
      <div className="ad-banner-track">
        {bannerProducts.map((product, index) => (
          <div
            key={product._id}
            className={`ad-banner-slide${index === currentIndex ? ' active' : ''}${
              !imageLoaded[product._id] ? ' loading' : ''
            }${isResetting ? ' reset-from-left' : ''}`}
            onClick={() => navigate('/products', { state: { selectedProduct: product } })}
          >
            <img
              src={product.adBanner}
              alt={product.name}
              onLoad={() => handleImageLoad(product._id)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-banner.jpg';
                handleImageLoad(product._id);
              }}
            />
          </div>
        ))}
      </div>
      {bannerProducts.length > 1 && (
        <div className="ad-banner-nav">
          <button 
            className="ad-banner-nav-button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('left');
            }}
          >
            ‹
          </button>
          <button 
            className="ad-banner-nav-button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('right');
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default AdBannerCarousel;
