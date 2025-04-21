import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = () => {
    setIsOpen(false); // Close menu on navigation
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavigation}>
          <span>Pillora</span>
        </Link>

        <button className="navbar-toggler" onClick={() => setIsOpen(!isOpen)}>
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li><Link to="/" className="nav-link" onClick={handleNavigation}>Home</Link></li>
            <li><Link to="/products" className="nav-link" onClick={handleNavigation}>Products</Link></li>
            <li><Link to="/about" className="nav-link" onClick={handleNavigation}>About</Link></li>
            <li><Link to="/contact" className="nav-link" onClick={handleNavigation}>Contact</Link></li>
          </ul>

          <div className="navbar-actions">
            <Link to="/cart" className="nav-action cart-btn" onClick={handleNavigation}>
              <i className="bi bi-basket"></i>
              {cartItemsCount > 0 && (
                <span className="action-badge">{cartItemsCount}</span>
              )}
            </Link>
            
            <div className="nav-action user-dropdown dropdown">
              <button className="user-btn" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link to="/customer-login" className="dropdown-item" onClick={handleNavigation}>
                    <i className="bi bi-person-circle"></i>
                    <span>Customer Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/vendor-login" className="dropdown-item" onClick={handleNavigation}>
                    <i className="bi bi-shop"></i>
                    <span>Vendor Login</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
