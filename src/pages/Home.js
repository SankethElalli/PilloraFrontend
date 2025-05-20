import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import ProductCarousel from '../components/ProductCarousel';
import AdBannerCarousel from '../components/AdBannerCarousel';

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay muted loop playsInline id="heroVideo">
            <source src="/video/med.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4 text-white">Your Health, Our Priority</h1>
              <p className="lead mb-4 text-white">Get your medicines delivered at your doorstep with our trusted online pharmacy service.</p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-light btn-lg">
                  <i className="bi bi-cart-plus me-2"></i>Shop Now
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg ms-3">
                  <i className="bi bi-info-circle me-2"></i>Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductCarousel />
      <AdBannerCarousel />

      <section className="features py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Why Choose Us</h2>
            <p className="lead text-muted">Experience the best in online pharmacy services</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon-wrapper mb-4">
                  <i className="bi bi-truck"></i>
                </div>
                <h4 className="mb-3">Fast Delivery</h4>
                <p className="text-muted">Get your medicines delivered within 24 hours with our express delivery service.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon-wrapper mb-4">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4 className="mb-3">Genuine Products</h4>
                <p className="text-muted">100% authentic medicines sourced directly from authorized manufacturers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon-wrapper mb-4">
                  <i className="bi bi-headset"></i>
                </div>
                <h4 className="mb-3">24/7 Support</h4>
                <p className="text-muted">Our dedicated team is always here to help you with any queries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
