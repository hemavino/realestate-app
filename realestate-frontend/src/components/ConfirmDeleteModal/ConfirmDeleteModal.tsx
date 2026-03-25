import React from 'react';
import type { Property } from '../../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  property: Property | null;
  isDeleting: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  property,
  isDeleting,
}) => {
  if (!isOpen || !property) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-backdrop" onClick={onClose}></div>

        <div className="modal-panel">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-icon-wrapper">
                <svg
                  className="modal-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="modal-header">
                <h3 className="modal-title">Delete Property</h3>
                <p className="modal-text">
                  Are you sure you want to delete{' '}
                  <span style={{ fontWeight: '600' }}>{property.title}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="btn btn-danger">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button type="button" onClick={onClose} disabled={isDeleting} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
