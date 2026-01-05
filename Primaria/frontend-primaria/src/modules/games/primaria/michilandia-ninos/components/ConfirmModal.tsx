import React from "react";
import { createPortal } from "react-dom";
import ModalShell from "./common/ModalShell";
import "./ModalCompraProductos.css";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Confirmar",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
}) => {
  const modal = (
    <ModalShell
      overlayClassName="modal-productos-overlay"
      containerClassName="modal-productos-container"
      overlayStyle={{ zIndex: 2147483647, background: "rgba(0,0,0,0.88)" }}
      containerStyle={{ maxWidth: 520 }}
      onOverlayClick={onCancel}
    >
      <div className="modal-productos-header" style={{ padding: "1rem" }}>
        <h2>{title}</h2>
      </div>

      <div style={{ padding: "1rem 1.2rem", color: "rgba(255,255,255,0.95)" }}>
        <p>{message}</p>
      </div>

      <div
        style={{
          padding: "0.8rem 1rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <button
          className="confirm-btn-cancel"
          onClick={onCancel}
          aria-label="Cancelar"
          style={{ width: "48%" }}
        >
          {cancelLabel}
        </button>
        <button
          className="confirm-btn-confirm"
          onClick={onConfirm}
          aria-label="Confirmar"
          style={{ width: "48%" }}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );

  if (typeof document !== "undefined")
    return createPortal(modal, document.body);
  return modal;
};

export default ConfirmModal;
