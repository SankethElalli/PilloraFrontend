import React from 'react';

function Toast({ message, type = 'info', onClose }) {
  return (
    <div className={`toast show border-${type}`}>
      <div className="toast-body">
        <i className={`bi bi-${getToastIcon(type)} me-2`}></i>
        {message}
        {onClose && (
          <button type="button" className="btn-close" onClick={onClose}></button>
        )}
      </div>
    </div>
  );
}

function getToastIcon(type) {
  const icons = {
    'success': 'check-circle-fill',
    'error': 'x-circle-fill',
    'warning': 'exclamation-circle-fill',
    'info': 'info-circle-fill'
  };
  return icons[type] || 'info-circle-fill';
}

export default Toast;
