import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ConfirmExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  itemType: 'video' | 'quiz';
}

export const ConfirmExitModal: React.FC<ConfirmExitModalProps> = ({
  onConfirm,
  onCancel,
  itemType,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>¿Descartar cambios?</h2>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <p>
              Estás editando un {itemType === 'video' ? 'video' : 'quiz'}. Si sales ahora, los cambios no se guardarán.
            </p>
            <p>¿Deseas salir sin guardar?</p>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn-delete" onClick={onConfirm}>
              Salir sin guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

