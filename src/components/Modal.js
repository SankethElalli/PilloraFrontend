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
