import React from 'react';

const ModalWrapper = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
