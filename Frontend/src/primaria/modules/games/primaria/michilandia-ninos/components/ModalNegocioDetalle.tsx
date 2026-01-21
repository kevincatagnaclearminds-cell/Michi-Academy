import React, { useState } from "react";
import {
  NEGOCIOS,
  Producto,
  getProductosPorNegocio,
  getImagenProducto,
} from "../types";
import { ProductoComprado } from "../hooks/useJuego";
import CartaNegocio from "./CartaNegocio";
import ModalShell from "./common/ModalShell";
import {
  getProductoImagenUrl,
  getProductoReversoUrl,
} from "./utils/productImages";
import { CartaExpandida, expandirCartasProducto } from "./utils/productCards";
import "./ModalCompraProductos.css"; // Reutilizamos los mismos estilos

interface ModalNegocioDetalleProps {
  negocioId: string;
  propietarioNombre: string;
  propietarioColor: string;
  propietarioColorFondo?: string;
  productosDelJugador?: ProductoComprado[];
  onClose: () => void;
}

// Componente de carta de producto para visualización (sin compra)
interface CartaProductoDetalleProps {
  producto: Producto;
  indice: number;
  tieneProducto: boolean; // true si el jugador tiene esta carta específica
  mostrarPrecioVenta?: boolean; // true para mostrar precio de venta en lugar de costo
}

const CartaProductoDetalle: React.FC<CartaProductoDetalleProps> = ({
  producto,
  indice,
  tieneProducto,
  mostrarPrecioVenta = true,
}) => {
  const [revelada, setRevelada] = useState(tieneProducto);

  // Usar la imagen correcta según el índice
  const nombreImagen = getImagenProducto(producto, indice);
  const imagenProducto = getProductoImagenUrl(nombreImagen);
  const imagenReverso = getProductoReversoUrl();

  return (
    <div
      className={`carta-producto-container ${
        tieneProducto ? "ya-comprada" : ""
      }`}
      onMouseEnter={() => setRevelada(true)}
      onMouseLeave={() => !tieneProducto && setRevelada(false)}
    >
      <div className={`carta-producto-flip ${revelada ? "revelada" : ""}`}>
        {/* Reverso de la carta */}
        <div className="carta-producto-cara carta-producto-reverso">
          <img src={imagenReverso} alt="Carta Producto" />
          <div className="carta-producto-hint">
            <span>👆</span>
            <p>Pasa el cursor para ver</p>
          </div>
        </div>

        {/* Frente de la carta */}
        <div className="carta-producto-cara carta-producto-frente">
          <img src={imagenProducto} alt={producto.nombre} />

          {/* Overlay de que lo tiene */}
          {tieneProducto && (
            <div className="carta-producto-owned">
              <span>✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Info del producto */}
      <div className="carta-producto-info">
        <span className="producto-nombre">{producto.nombre}</span>
        <span className="producto-costo">
          {mostrarPrecioVenta
            ? `💰 Precio: $${producto.precio}`
            : `💵 Costo: $${producto.costo}`}
        </span>
      </div>

      {/* Estado del producto */}
      <button
        className={`btn-producto ${
          tieneProducto ? "btn-ya-comprado" : "btn-sin-stock"
        }`}
        disabled
      >
        {tieneProducto ? "✓ En inventario" : "Sin stock"}
      </button>
    </div>
  );
};

const ModalNegocioDetalle: React.FC<ModalNegocioDetalleProps> = ({
  negocioId,
  propietarioNombre,
  propietarioColor,
  propietarioColorFondo,
  productosDelJugador = [],
  onClose,
}) => {
  const negocio = NEGOCIOS.find((n) => n.id === negocioId);
  const productosDelNegocio = getProductosPorNegocio(negocioId);

  if (!negocio) return null;

  const cartasExpandidas: CartaExpandida[] =
    expandirCartasProducto(productosDelNegocio);

  // Verificar si una carta específica está en el inventario del jugador
  const tieneCartaEnInventario = (
    productoId: string,
    indice: number
  ): boolean => {
    const comprado = productosDelJugador.find(
      (p) => p.productoId === productoId && p.negocioId === negocioId
    );
    // Si tiene N comprados, las primeras N cartas están en inventario
    return comprado ? indice < comprado.cantidad : false;
  };

  // Contar productos totales en inventario
  const totalProductos = productosDelJugador
    .filter((p) => p.negocioId === negocioId)
    .reduce((sum, p) => sum + p.cantidad, 0);

  // Calcular valor total del inventario (precio de venta)
  const valorInventario = productosDelJugador
    .filter((p) => p.negocioId === negocioId)
    .reduce((sum, p) => {
      const producto = productosDelNegocio.find(
        (prod) => prod.id === p.productoId
      );
      return sum + (producto?.precio || 0) * p.cantidad;
    }, 0);

  const colorFondo =
    propietarioColorFondo ||
    `linear-gradient(135deg, ${propietarioColor}dd 0%, ${propietarioColor}99 100%)`;

  return (
    <ModalShell
      overlayClassName="modal-productos-overlay"
      containerClassName="modal-productos-container"
      containerStyle={{
        borderColor: propietarioColor,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 4px ${propietarioColor}80`,
      }}
      onOverlayClick={onClose}
    >
      <button
        className="modal-detalle-cerrar-btn"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "rgba(0,0,0,0.3)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "1.5rem",
          color: "white",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
      >
        ✕
      </button>

      <div
        className="modal-productos-header"
        style={{ background: colorFondo }}
      >
        <h2>🏪 {negocio.nombre}</h2>
        <p>
          Propiedad de <strong>{propietarioNombre}</strong>
        </p>
      </div>

      <div className="modal-productos-content">
        <div className="modal-productos-negocio">
          <h3>📍 Tu Negocio</h3>
          <CartaNegocio negocioId={negocio.id} revelada size="medium" />
          <div className="negocio-info">
            <span className="negocio-nombre">{negocio.nombre}</span>
          </div>
        </div>

        <div className="modal-productos-lista">
          <h3>📦 Inventario de Productos</h3>
          <p className="productos-instruccion">
            {totalProductos > 0
              ? "Pasa el cursor sobre las cartas para ver los detalles de tus productos."
              : "¡Este negocio está vacío! Compra productos para poder venderlos a los clientes."}
          </p>

          <div className="productos-scroll-container">
            <div className="productos-horizontal">
              {cartasExpandidas.map((carta) => {
                const tieneProducto = tieneCartaEnInventario(
                  carta.producto.id,
                  carta.indice
                );

                return (
                  <CartaProductoDetalle
                    key={carta.cartaId}
                    producto={carta.producto}
                    indice={carta.indice}
                    tieneProducto={tieneProducto}
                    mostrarPrecioVenta
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-productos-footer">
        <div className="resumen-compra">
          <div className="resumen-item">
            <span>💰 Valor del negocio:</span>
            <span className="dinero-actual">${negocio.precio}</span>
          </div>
          <div className="resumen-item">
            <span>📦 En inventario:</span>
            <span className="dinero-actual">{totalProductos} productos</span>
          </div>
          <div className="resumen-item">
            <span>💵 Valor inventario:</span>
            <span className="dinero-actual" style={{ color: "#4ECDC4" }}>
              ${valorInventario}
            </span>
          </div>
        </div>

        <div className="acciones-compra">
          <button
            className="btn-confirmar"
            onClick={onClose}
            style={{
              background: `linear-gradient(135deg, ${propietarioColor} 0%, ${propietarioColor}cc 100%)`,
            }}
          >
            ✓ Cerrar
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default ModalNegocioDetalle;
