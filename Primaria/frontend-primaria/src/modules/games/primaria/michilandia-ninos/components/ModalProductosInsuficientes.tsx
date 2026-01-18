import React from "react";
import "./ModalProductosInsuficientes.css";

interface ModalProductosInsuficientesProps {
  isOpen: boolean;
  onClose: () => void;
  nombreJugador: string;
  productosActuales: number;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

export const ModalProductosInsuficientes: React.FC<
  ModalProductosInsuficientesProps
> = ({
  isOpen,
  onClose,
  nombreJugador,
  productosActuales,
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-productos-insuficientes-overlay">
      <div
        className="modal-productos-insuficientes-container"
        style={{
          borderColor: jugadorColor,
          boxShadow: `0 0 30px ${jugadorColor}66, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="modal-productos-insuficientes-header"
          style={{ background: jugadorColorFondo }}
        >
          <h2>⚠️ Venta no concretada</h2>
          <p>
            Problema con <strong>{nombreJugador}</strong>
          </p>
        </div>

        <div className="modal-productos-insuficientes-content">
          <p className="mensaje-principal">
            No se pudo concretar la venta al cliente ya que{" "}
            <strong className="jugador-nombre">{nombreJugador}</strong> no tiene
            suficientes productos para vender.
          </p>
          <div className="info-productos">
            <div className="info-item">
              <span className="label">Productos necesarios:</span>
              <span className="valor necesarios">3</span>
            </div>
            <div className="info-item">
              <span className="label">Productos disponibles:</span>
              <span className="valor actuales">{productosActuales}</span>
            </div>
            <div className="info-item faltantes">
              <span className="label">Faltan:</span>
              <span className="valor">{3 - productosActuales}</span>
            </div>
          </div>
        </div>

        <div className="modal-productos-insuficientes-footer">
          <button
            className="btn-entendido"
            onClick={onClose}
            style={{
              background: jugadorColorFondo,
              borderColor: jugadorColor,
            }}
          >
            ✓ Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
