import React, { useState } from "react";
import { Negocio, Producto, getProductosPorNegocio, PRODUCTO_REVERSO } from "../types";
import { ProductoComprado } from "../hooks/useJuego";
import CartaNegocio from "./CartaNegocio";
import "./ModalCompraProductos.css";

// Importar todas las imágenes de productos
const importarImagenesProductos = () => {
  const imagenes: { [key: string]: string } = {};
  
  // Importar dinámicamente todas las imágenes de productos
  const context = import.meta.glob('../assets/cartas/productos/*.jpg', { eager: true, as: 'url' });
  
  Object.entries(context).forEach(([path, url]) => {
    const fileName = path.split('/').pop() || '';
    imagenes[fileName] = url as string;
  });
  
  return imagenes;
};

const IMAGENES_PRODUCTOS = importarImagenesProductos();

interface ModalCompraProductosProps {
  negocio: Negocio;
  dineroJugador: number;
  productosSeleccionados: string[];
  productosYaComprados: ProductoComprado[];
  onToggleProducto: (productoId: string) => void;
  onConfirmar: () => void;
  onSaltar: () => void;
  jugadorNombre?: string;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

interface CartaProductoProps {
  producto: Producto;
  indice: number; // Índice de la carta (para productos con cantidad > 1)
  seleccionado: boolean;
  yaComprado: boolean;
  onToggle: () => void;
  disabled: boolean;
}

const CartaProducto: React.FC<CartaProductoProps> = ({
  producto,
  indice,
  seleccionado,
  yaComprado,
  onToggle,
  disabled,
}) => {
  const [revelada, setRevelada] = useState(yaComprado || seleccionado);

  const imagenProducto = IMAGENES_PRODUCTOS[producto.imagen] || IMAGENES_PRODUCTOS[PRODUCTO_REVERSO];
  const imagenReverso = IMAGENES_PRODUCTOS[PRODUCTO_REVERSO];

  return (
    <div
      className={`carta-producto-container ${seleccionado ? "seleccionada" : ""} ${yaComprado ? "ya-comprada" : ""}`}
      onMouseEnter={() => !yaComprado && setRevelada(true)}
      onMouseLeave={() => !yaComprado && !seleccionado && setRevelada(false)}
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

          {/* Overlay de seleccionado */}
          {seleccionado && (
            <div className="carta-producto-check">
              <span>✓</span>
            </div>
          )}

          {/* Overlay de ya comprado */}
          {yaComprado && (
            <div className="carta-producto-owned">
              <span>✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Info del producto */}
      <div className="carta-producto-info">
        <span className="producto-nombre">{producto.nombre}</span>
        <span className="producto-precio">💰 ${producto.precio}</span>
      </div>

      {/* Botón de acción */}
      {yaComprado ? (
        <button className="btn-producto btn-ya-comprado" disabled>
          ✓ Tienes
        </button>
      ) : (
        <button
          className={`btn-producto ${seleccionado ? "btn-quitar" : "btn-agregar"}`}
          onClick={onToggle}
          disabled={disabled && !seleccionado}
        >
          {seleccionado ? "✗ Quitar" : "🛒 Comprar"}
        </button>
      )}
    </div>
  );
};

// Interfaz para carta expandida (cada carta individual)
interface CartaExpandida {
  producto: Producto;
  indice: number;
  cartaId: string; // ID único para cada carta
}

const ModalCompraProductos: React.FC<ModalCompraProductosProps> = ({
  negocio,
  dineroJugador,
  productosSeleccionados,
  productosYaComprados,
  onToggleProducto,
  onConfirmar,
  onSaltar,
  jugadorNombre = "Jugador",
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
}) => {
  const productosDelNegocio = getProductosPorNegocio(negocio.id);

  // Expandir productos según su cantidad (si tiene cantidad 2, crear 2 cartas)
  const cartasExpandidas: CartaExpandida[] = productosDelNegocio.flatMap((producto) => {
    return Array.from({ length: producto.cantidad }, (_, i) => ({
      producto,
      indice: i,
      cartaId: `${producto.id}_${i}`, // ID único: productoId_0, productoId_1
    }));
  });

  // Extraer productoId de un cartaId (formato: "productoId_indice")
  const extraerProductoId = (cartaId: string): string => {
    const partes = cartaId.split('_');
    partes.pop(); // Remover el índice (último elemento)
    return partes.join('_');
  };

  // Calcular costo total de productos seleccionados
  const costoTotal = productosSeleccionados.reduce((total, cartaId) => {
    const productoId = extraerProductoId(cartaId);
    const producto = productosDelNegocio.find(p => p.id === productoId);
    return total + (producto?.precio || 0);
  }, 0);

  const puedeConfirmar = dineroJugador >= costoTotal;
  const dineroRestante = dineroJugador - costoTotal;

  // Verificar si una carta específica ya está comprada
  const estaCartaComprada = (cartaId: string): boolean => {
    const productoId = extraerProductoId(cartaId);
    const partes = cartaId.split('_');
    const indice = parseInt(partes[partes.length - 1]);
    const comprado = productosYaComprados.find(p => p.productoId === productoId);
    // Si tiene N comprados, las primeras N cartas están compradas
    return comprado ? indice < comprado.cantidad : false;
  };

  return (
    <div className="modal-productos-overlay">
      <div
        className="modal-productos-container"
        style={{
          borderColor: jugadorColor,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 4px ${jugadorColor}80`,
        }}
      >
        {/* Header */}
        <div
          className="modal-productos-header"
          style={{ background: jugadorColorFondo }}
        >
          <h2>🛍️ Compra de Productos</h2>
          <p>Turno de <strong>{jugadorNombre}</strong></p>
        </div>

        {/* Contenido principal */}
        <div className="modal-productos-content">
          {/* Lado izquierdo - Carta del negocio */}
          <div className="modal-productos-negocio">
            <h3>Tu Nuevo Negocio</h3>
            <CartaNegocio
              negocioId={negocio.id}
              revelada={true}
              size="medium"
            />
            <div className="negocio-info">
              <span className="negocio-nombre">{negocio.nombre}</span>
            </div>
          </div>

          {/* Lado derecho - Productos (scroll horizontal) */}
          <div className="modal-productos-lista">
            <h3>📦 Productos Disponibles</h3>
            <p className="productos-instruccion">
              Pasa el cursor sobre las cartas para revelarlas y selecciona los productos que deseas comprar.
            </p>

            <div className="productos-scroll-container">
              <div className="productos-horizontal">
                {cartasExpandidas.map((carta) => {
                  const yaComprada = estaCartaComprada(carta.cartaId);
                  const seleccionada = productosSeleccionados.includes(carta.cartaId);

                  return (
                    <CartaProducto
                      key={carta.cartaId}
                      producto={carta.producto}
                      indice={carta.indice}
                      seleccionado={seleccionada}
                      yaComprado={yaComprada}
                      onToggle={() => onToggleProducto(carta.cartaId)}
                      disabled={dineroJugador < carta.producto.precio && !seleccionada}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con resumen */}
        <div className="modal-productos-footer">
          <div className="resumen-compra">
            <div className="resumen-item">
              <span>💰 Tu dinero:</span>
              <span className="dinero-actual">${dineroJugador}</span>
            </div>
            <div className="resumen-item">
              <span>🛒 Costo total:</span>
              <span className={`costo-total ${!puedeConfirmar ? "insuficiente" : ""}`}>
                ${costoTotal}
              </span>
            </div>
            <div className="resumen-item">
              <span>📊 Restante:</span>
              <span className={`dinero-restante ${dineroRestante < 0 ? "negativo" : ""}`}>
                ${dineroRestante}
              </span>
            </div>
          </div>

          <div className="acciones-compra">
            <button
              className="btn-saltar"
              onClick={onSaltar}
            >
              ⏭️ Abrir Sin Productos
            </button>
            <button
              className="btn-confirmar"
              onClick={onConfirmar}
              disabled={!puedeConfirmar}
              style={{
                background: puedeConfirmar
                  ? `linear-gradient(135deg, ${jugadorColor} 0%, ${jugadorColor}cc 100%)`
                  : undefined,
              }}
            >
              ✓ Confirmar Compra ({productosSeleccionados.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCompraProductos;

