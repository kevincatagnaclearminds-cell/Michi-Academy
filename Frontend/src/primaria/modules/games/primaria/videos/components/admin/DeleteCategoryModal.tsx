import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface DeleteCategoryModalProps {
  categoryName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  categoryName,
  onConfirm,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Eliminar Categoría</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <p>
              ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoryName}"</strong>?
            </p>
            <p className="warning-text">
              Se eliminarán todos los videos y el quiz asociados a esta categoría. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn-delete" onClick={onConfirm}>
              Eliminar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};




