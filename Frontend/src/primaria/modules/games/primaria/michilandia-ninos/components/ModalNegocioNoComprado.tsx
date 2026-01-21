import React from "react";
import "./ModalNegocioNoComprado.css";

interface ModalNegocioNoCompradoProps {
  isOpen: boolean;
  onClose: () => void;
  nombreNegocio: string;
  jugadorNombre?: string;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

export const ModalNegocioNoComprado: React.FC<ModalNegocioNoCompradoProps> = ({
  isOpen,
  onClose,
  nombreNegocio,
  jugadorNombre = "Jugador",
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-negocio-no-comprado-overlay">
      <div
        className="modal-negocio-no-comprado-container"
        style={{
          borderColor: jugadorColor,
          boxShadow: `0 0 30px ${jugadorColor}66, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="modal-negocio-no-comprado-header"
          style={{ background: jugadorColorFondo }}
        >
          <h2>⚠️ Negocio sin propietario</h2>
          <p>
            Turno de <strong>{jugadorNombre}</strong>
          </p>
        </div>

        <div className="modal-negocio-no-comprado-content">
          <div className="mensaje-principal">
            <p>
              La carta te ha llevado al negocio{" "}
              <strong className="negocio-nombre">{nombreNegocio}</strong>, pero
              este negocio aún no tiene propietario.
            </p>
          </div>

          <div className="info-restriccion">
            <div className="icono-restriccion">🚫</div>
            <div className="texto-restriccion">
              <p className="titulo-restriccion">No se puede comprar</p>
              <p className="detalle-restriccion">
                Solo puedes comprar negocios cuando el cliente cae directamente
                en ellos tirando el dado.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-negocio-no-comprado-footer">
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
