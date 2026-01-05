import React from "react";
import "./ModalCompraForzada.css";

interface ModalCompraForzadaProps {
  isOpen: boolean;
  onClose: () => void;
  nombreProducto: string;
  precioProducto: number;
  nombreNegocio: string;
  nombrePropietario: string;
  colorPropietario: string;
  colorFondoPropietario: string;
}

export const ModalCompraForzada: React.FC<ModalCompraForzadaProps> = ({
  isOpen,
  onClose,
  nombreProducto,
  precioProducto,
  nombreNegocio,
  nombrePropietario,
  colorPropietario,
  colorFondoPropietario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-compra-forzada-overlay">
      <div
        className="modal-compra-forzada-container"
        style={{
          borderColor: colorPropietario,
          boxShadow: `0 0 30px ${colorPropietario}66, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="modal-compra-forzada-header"
          style={{ background: colorFondoPropietario }}
        >
          <h2>🛒 Compra realizada</h2>
          <p className="subtitulo">La compra obligatoria se completó</p>
        </div>

        <div className="modal-compra-forzada-content">
          <div className="resumen">
            <div className="dato">
              <span className="etiqueta">Producto</span>
              <span className="valor">{nombreProducto}</span>
            </div>
            <div className="dato">
              <span className="etiqueta">Precio</span>
              <span className="valor">${precioProducto}</span>
            </div>
            <div className="dato">
              <span className="etiqueta">Negocio</span>
              <span className="valor">{nombreNegocio}</span>
            </div>
            <div className="dato">
              <span className="etiqueta">Vendedor</span>
              <span className="valor">{nombrePropietario}</span>
            </div>
          </div>

          <div className="alerta-exito">
            <div className="emoji">✅</div>
            <div>
              <p className="titulo-alerta">Venta exitosa</p>
              <p className="detalle-alerta">
                El cliente pagó ${precioProducto} y el monto se agregó al dinero
                de {nombrePropietario}.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-compra-forzada-footer">
          <button
            className="btn-entendido"
            onClick={onClose}
            style={{
              background: colorFondoPropietario,
              borderColor: colorPropietario,
            }}
          >
            ✓ Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
