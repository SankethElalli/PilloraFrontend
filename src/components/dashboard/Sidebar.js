import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Sidebar.css';

function Sidebar({ type = 'vendor', onSectionChange, menuItems, className, currentSection }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate(type === 'vendor' ? '/vendor-login' : '/customer-login');
  };

  const handleSectionClick = (id) => {
    if (onSectionChange) onSectionChange(id);
  };

  const defaultMenuItems = type === 'vendor' ? [
    { title: 'Products', icon: 'bi bi-box-seam', id: 'products' },
    { title: 'Orders', icon: 'bi bi-cart3', id: 'orders' },
    { title: 'Prescriptions', icon: 'bi bi-file-medical', id: 'prescriptions' }
  ] : menuItems;

  const isActive = (id) => currentSection === id || location.hash === `#${id}`;

  return (
    <nav className={`dashboard-sidebar ${className || ''}`}>
      <ul className="nav-menu">
        {defaultMenuItems.map((item) => (
          <li className="nav-item" key={item.id}>
            <button
              className={`nav-link ${isActive(item.id) ? 'active' : ''}`}
              onClick={() => handleSectionClick(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
