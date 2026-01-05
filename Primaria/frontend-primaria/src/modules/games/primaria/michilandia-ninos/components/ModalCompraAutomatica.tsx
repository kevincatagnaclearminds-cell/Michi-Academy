import React from "react";
import ModalShell from "./common/ModalShell";
import "./ModalCompraAutomatica.css";

interface ModalCompraAutomaticaProps {
  isOpen: boolean;
  onClose: () => void;
  nombreProducto: string;
  precioProducto: number;
  nombreNegocio: string;
  nombrePropietario: string;
  tipoProducto: "mas_caro" | "mas_barato";
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

export const ModalCompraAutomatica: React.FC<ModalCompraAutomaticaProps> = ({
  isOpen,
  onClose,
  nombreProducto,
  precioProducto,
  nombreNegocio,
  nombrePropietario,
  tipoProducto,
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  if (!isOpen) return null;

  const tipoLabel = tipoProducto === "mas_caro" ? "más costoso" : "más barato";

  return (
    <ModalShell
      overlayClassName="modal-compra-automatica-overlay"
      containerClassName="modal-compra-automatica-container"
      containerStyle={{
        borderColor: jugadorColor,
        boxShadow: `0 0 30px ${jugadorColor}66, 0 20px 60px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        className="modal-compra-automatica-header"
        style={{ background: jugadorColorFondo }}
      >
        <h2>🛒 ¡Compra Completada!</h2>
      </div>

      <div className="modal-compra-automatica-content">
        <p className="mensaje-principal">
          El cliente compró automáticamente el producto {tipoLabel}
        </p>

        <div className="compra-detalle">
          <div className="detalle-producto">
            <div className="etiqueta">Producto:</div>
            <div className="valor">{nombreProducto}</div>
          </div>

          <div className="detalle-precio">
            <div className="etiqueta">Precio:</div>
            <div className="valor">${precioProducto}</div>
          </div>

          <div className="detalle-negocio">
            <div className="etiqueta">Negocio:</div>
            <div className="valor">{nombreNegocio}</div>
          </div>

          <div className="detalle-propietario">
            <div className="etiqueta">Vendedor:</div>
            <div className="valor">{nombrePropietario}</div>
          </div>
        </div>

        <div className="resumen-transaccion">
          <p className="texto-resumen">
            ✓ Se descargó ${precioProducto} del dinero del cliente
          </p>
          <p className="texto-resumen">
            ✓ Se agregaron ${precioProducto} al dinero de {nombrePropietario}
          </p>
        </div>
      </div>

      <div className="modal-compra-automatica-footer">
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
    </ModalShell>
  );
};
