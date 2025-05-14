import React from 'react';

function Modal({ isOpen, onClose, title, children, horizontal, shareUrl }) {
  if (!isOpen) return null;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;
  const containerClass =
    "modal-container" +
    (horizontal && isDesktop ? " product-modal-horizontal" : "");

  const handleShare = (platform) => {
    const url = shareUrl || window.location.href;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Check this out&body=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy:', err));
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={containerClass}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="modal-content">{children}</div>
        
        <div className="modal-share-section">
          <div className="share-title">Share via</div>
          <div className="share-buttons">
            <button 
              className="share-button whatsapp"
              onClick={() => handleShare('whatsapp')}
            >
              <i className="bi bi-whatsapp"></i>
            </button>
            <button 
              className="share-button email"
              onClick={() => handleShare('email')}
            >
              <i className="bi bi-envelope"></i>
            </button>
            <button 
              className="share-button copy"
              onClick={() => handleShare('copy')}
            >
              <i className="bi bi-link-45deg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
