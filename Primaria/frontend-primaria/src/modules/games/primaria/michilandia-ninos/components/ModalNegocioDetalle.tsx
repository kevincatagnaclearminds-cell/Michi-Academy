import React from "react";
import CartaNegocio from "./CartaNegocio";
import { NEGOCIOS, PRODUCTOS, getProductosPorNegocio, PRODUCTO_REVERSO } from "../types";
import { ProductoComprado } from "../hooks/useJuego";
import "./ModalNegocioDetalle.css";

// Importar imágenes de productos
const importarImagenesProductos = () => {
  const imagenes: { [key: string]: string } = {};
  const context = import.meta.glob('../assets/cartas/productos/*.jpg', { eager: true, as: 'url' });
  Object.entries(context).forEach(([path, url]) => {
    const fileName = path.split('/').pop() || '';
    imagenes[fileName] = url as string;
  });
  return imagenes;
};

const IMAGENES_PRODUCTOS = importarImagenesProductos();

interface ModalNegocioDetalleProps {
  negocioId: string;
  propietarioNombre: string;
  propietarioColor: string;
  productosDelJugador?: ProductoComprado[];
  onClose: () => void;
}

const ModalNegocioDetalle: React.FC<ModalNegocioDetalleProps> = ({
  negocioId,
  propietarioNombre,
  propietarioColor,
  productosDelJugador = [],
  onClose,
}) => {
  const negocio = NEGOCIOS.find((n) => n.id === negocioId);
  const productosDelNegocio = getProductosPorNegocio(negocioId);

  if (!negocio) return null;

  // Obtener cantidad de un producto que tiene el jugador
  const getCantidadProducto = (productoId: string): number => {
    const comprado = productosDelJugador.find(p => p.productoId === productoId);
    return comprado?.cantidad || 0;
  };

  // Contar productos totales en inventario
  const totalProductos = productosDelJugador
    .filter(p => p.negocioId === negocioId)
    .reduce((sum, p) => sum + p.cantidad, 0);

  return (
    <div className="modal-detalle-overlay" onClick={onClose}>
      <div
        className="modal-detalle-container modal-detalle-con-productos"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: propietarioColor }}
      >
        <button className="modal-detalle-cerrar" onClick={onClose}>
          ✕
        </button>

        <div
          className="modal-detalle-header"
          style={{
            background: `linear-gradient(135deg, ${propietarioColor}dd 0%, ${propietarioColor}99 100%)`,
          }}
        >
          <h2>🏪 {negocio.nombre}</h2>
          <p>
            Propiedad de <strong>{propietarioNombre}</strong>
          </p>
        </div>

        <div className="modal-detalle-content">
          {/* Lado izquierdo - Carta del negocio */}
          <div className="modal-detalle-carta">
            <CartaNegocio negocioId={negocioId} revelada={true} size="large" />
            
            <div className="modal-detalle-info-compacta">
              <div className="detalle-item-mini">
                <span>💰 Valor:</span>
                <span>${negocio.precio}</span>
              </div>
              <div className="detalle-item-mini">
                <span>🏠 Renta:</span>
                <span>${Math.round(negocio.precio * 0.2)}</span>
              </div>
              <div className="detalle-item-mini">
                <span>📦 Inventario:</span>
                <span>{totalProductos} productos</span>
              </div>
            </div>
          </div>

          {/* Lado derecho - Productos */}
          <div className="modal-detalle-productos">
            <h3>📦 Inventario de Productos</h3>
            
            {totalProductos === 0 ? (
              <div className="productos-vacio">
                <span className="emoji-vacio">📭</span>
                <p>¡Este negocio está vacío!</p>
                <p className="texto-ayuda">No podrás vender hasta que compres productos.</p>
              </div>
            ) : (
              <div className="productos-inventario-grid">
                {productosDelNegocio.map((producto) => {
                  const cantidad = getCantidadProducto(producto.id);
                  const tieneProducto = cantidad > 0;
                  const imagenProducto = IMAGENES_PRODUCTOS[producto.imagen] || IMAGENES_PRODUCTOS[PRODUCTO_REVERSO];

                  return (
                    <div 
                      key={producto.id} 
                      className={`producto-inventario-item ${tieneProducto ? 'tiene-producto' : 'sin-producto'}`}
                    >
                      <div className="producto-inventario-carta">
                        <img 
                          src={tieneProducto ? imagenProducto : IMAGENES_PRODUCTOS[PRODUCTO_REVERSO]} 
                          alt={producto.nombre}
                          className={tieneProducto ? '' : 'carta-oculta'}
                        />
                        {tieneProducto && (
                          <div className="producto-cantidad-badge">
                            {cantidad}/{producto.cantidad}
                          </div>
                        )}
                      </div>
                      <div className="producto-inventario-info">
                        <span className="producto-nombre-mini">
                          {tieneProducto ? producto.nombre : '???'}
                        </span>
                        {tieneProducto && (
                          <span className="producto-precio-venta">
                            Venta: ${producto.precioVenta}
                          </span>
                        )}
                      </div>
                      <button 
                        className={`btn-producto-estado ${tieneProducto ? 'btn-disponible' : 'btn-agotado'}`}
                        disabled
                      >
                        {tieneProducto ? `✓ Tienes ${cantidad}` : 'Sin stock'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNegocioDetalle;

