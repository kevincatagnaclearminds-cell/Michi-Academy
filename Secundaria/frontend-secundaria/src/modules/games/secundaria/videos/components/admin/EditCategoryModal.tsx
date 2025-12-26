import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface EditCategoryModalProps {
  currentName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  currentName,
  onSave,
  onClose,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      if (currentName && newName.trim() !== currentName) {
        onSave(newName.trim());
      } else if (!currentName) {
        // Es una nueva categoría
        onSave(newName.trim());
      } else {
        onClose();
      }
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{currentName ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="category-name">Nombre de la categoría</label>
            <input
              id="category-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={currentName ? "Ej: Finanzas, Matemáticas..." : "Nombre de la nueva categoría"}
              autoFocus
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {currentName ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

