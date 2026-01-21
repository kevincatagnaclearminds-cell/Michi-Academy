import React from "react";
import "./ModalProductoNoDisponible.css";

interface ModalProductoNoDisponibleProps {
  isOpen: boolean;
  onClose: () => void;
  nombreProducto: string;
  nombreNegocio: string;
  razon: "sin_stock" | "sin_propietario" | "no_existe";
  nombrePropietario?: string;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

export const ModalProductoNoDisponible: React.FC<
  ModalProductoNoDisponibleProps
> = ({
  isOpen,
  onClose,
  nombreProducto,
  nombreNegocio,
  razon,
  nombrePropietario,
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  if (!isOpen) return null;

  const mensajes = {
    sin_stock: {
      titulo: "Producto agotado",
      icono: "📦",
      mensaje: `El producto "${nombreProducto}" no está disponible en el negocio "${nombreNegocio}".`,
      razonDetalle: nombrePropietario
        ? `El dueño ${nombrePropietario} no tiene stock de este producto.`
        : "El dueño del negocio no tiene stock de este producto.",
    },
    sin_propietario: {
      titulo: "Negocio sin propietario",
      icono: "🏪",
      mensaje: `El negocio "${nombreNegocio}" aún no tiene propietario.`,
      razonDetalle:
        "No se puede comprar el producto porque nadie es dueño de este negocio.",
    },
    no_existe: {
      titulo: "Producto no encontrado",
      icono: "❓",
      mensaje: `El producto "${nombreProducto}" no pertenece al negocio "${nombreNegocio}".`,
      razonDetalle: "Este producto no se vende en este negocio.",
    },
  };

  const info = mensajes[razon];

  return (
    <div className="modal-producto-no-disponible-overlay">
      <div
        className="modal-producto-no-disponible-container"
        style={{
          borderColor: jugadorColor,
          boxShadow: `0 0 30px ${jugadorColor}66, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="modal-producto-no-disponible-header"
          style={{ background: jugadorColorFondo }}
        >
          <h2>
            {info.icono} {info.titulo}
          </h2>
        </div>

        <div className="modal-producto-no-disponible-content">
          <p className="mensaje-principal">{info.mensaje}</p>

          <div className="info-razon">
            <div className="icono-razon">⚠️</div>
            <p className="texto-razon">{info.razonDetalle}</p>
          </div>

          <p className="mensaje-explicacion">
            El cliente no realizó ninguna compra. El juego continúa normalmente.
          </p>
        </div>

        <div className="modal-producto-no-disponible-footer">
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
