import React from 'react';

function Modal({ isOpen, onClose, title, children, horizontal }) {
  if (!isOpen) return null;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;
  const containerClass =
    "modal-container" +
    (horizontal && isDesktop ? " product-modal-horizontal" : "");

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
      </div>
    </div>
  );
}

export default Modal;
