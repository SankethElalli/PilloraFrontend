import React, { useState } from 'react';

function Modal({ isOpen, onClose, title, children, horizontal }) {
  const [showShareToast, setShowShareToast] = useState(false);
  
  if (!isOpen) return null;

  const handleShare = (platform) => {
    const url = window.location.href;
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setShowShareToast(true);
          setTimeout(() => setShowShareToast(false), 2000);
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-container${horizontal ? ' product-modal-horizontal' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="modal-content">{children}</div>
        
        {/* Share Section */}
        <div className="modal-share-section">
          <div className="share-title">Share via</div>
          <div className="share-buttons">
            <button className="share-button whatsapp" onClick={() => handleShare('whatsapp')}>
              <i className="bi bi-whatsapp"></i>
            </button>
            <button className="share-button email" onClick={() => handleShare('email')}>
              <i className="bi bi-envelope"></i>
            </button>
            <button className="share-button copy" onClick={() => handleShare('copy')}>
              <i className="bi bi-clipboard"></i>
            </button>
          </div>
        </div>

        {/* Copy Toast */}
        {showShareToast && (
          <div className="copy-toast">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
