import React, { useState } from "react";
import {
  Negocio,
  Producto,
  getProductosPorNegocio,
  getImagenProducto,
} from "../types";
import { ProductoComprado } from "../hooks/useJuego";
import { extraerProductoIdDeCartaId } from "../hooks/utils/juego.utils";
import CartaNegocio from "./CartaNegocio";
import ModalShell from "./common/ModalShell";
import {
  getProductoImagenUrl,
  getProductoReversoUrl,
} from "./utils/productImages";
import { CartaExpandida, expandirCartasProducto } from "./utils/productCards";
import "./ModalCompraProductos.css";

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

  const nombreImagen = getImagenProducto(producto, indice);
  const imagenProducto = getProductoImagenUrl(nombreImagen);
  const imagenReverso = getProductoReversoUrl();

  const handleClick = () => {
    if (yaComprado || disabled) return;
    onToggle();
    setRevelada(true);
  };

  return (
    <div
      className={`carta-producto-container ${
        seleccionado ? "seleccionada" : ""
      } ${yaComprado ? "ya-comprada" : ""} ${disabled ? "deshabilitada" : ""}`}
      onMouseEnter={() => !yaComprado && setRevelada(true)}
      onMouseLeave={() => !yaComprado && !seleccionado && setRevelada(false)}
      onClick={handleClick}
    >
      <div className={`carta-producto-flip ${revelada ? "revelada" : ""}`}>
        <div className="carta-producto-cara carta-producto-reverso">
          <img src={imagenReverso} alt="Carta Producto" />
          <div className="carta-producto-hint">
            <span>👆</span>
            <p>Pasa el cursor para ver</p>
          </div>
        </div>

        <div className="carta-producto-cara carta-producto-frente">
          <img src={imagenProducto} alt={producto.nombre} />
          {seleccionado && (
            <div className="carta-producto-check">
              <span>✓</span>
            </div>
          )}
          {yaComprado && (
            <div className="carta-producto-owned">
              <span>✓</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalCompraProductos: React.FC<ModalCompraProductosProps> = ({
  negocio,
  dineroJugador,
  productosSeleccionados,
  productosYaComprados,
  onToggleProducto,
  onConfirmar,
  onSaltar,
  jugadorNombre,
  jugadorColor,
  jugadorColorFondo,
}) => {
  const productosDelNegocio = getProductosPorNegocio(negocio.id);
  const cartasExpandidas: CartaExpandida[] =
    expandirCartasProducto(productosDelNegocio);

  const costoTotal = productosSeleccionados.reduce((total, cartaId) => {
    const productoId = extraerProductoIdDeCartaId(cartaId);
    const producto = productosDelNegocio.find((p) => p.id === productoId);
    return total + (producto?.costo || 0);
  }, 0);

  const puedeConfirmar = dineroJugador >= costoTotal;
  const dineroRestante = dineroJugador - costoTotal;

  const estaCartaComprada = (cartaId: string): boolean => {
    const productoId = extraerProductoIdDeCartaId(cartaId);
    const partes = cartaId.split("_");
    const indice = parseInt(partes[partes.length - 1]);
    const comprado = productosYaComprados.find(
      (p) => p.productoId === productoId && p.negocioId === negocio.id
    );
    return comprado ? indice < comprado.cantidad : false;
  };

  return (
    <ModalShell
      overlayClassName="modal-productos-overlay"
      containerClassName="modal-productos-container"
      containerStyle={{
        borderColor: jugadorColor,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 4px ${jugadorColor}80`,
      }}
    >
      <div
        className="modal-productos-header"
        style={{ background: jugadorColorFondo }}
      >
        <h2>🛍️ Compra de Productos</h2>
        <p>
          Turno de <strong>{jugadorNombre}</strong>
        </p>
      </div>

      <div className="modal-productos-content">
        <div className="modal-productos-negocio">
          <h3>Tu Nuevo Negocio</h3>
          <CartaNegocio negocioId={negocio.id} revelada size="medium" />
          <div className="negocio-info">
            <span className="negocio-nombre">{negocio.nombre}</span>
          </div>
        </div>

        <div className="modal-productos-lista">
          <h3>📦 Productos Disponibles</h3>
          <p className="productos-instruccion">
            Pasa el cursor sobre las cartas para revelarlas y selecciona los
            productos que deseas comprar.
          </p>

          <div className="productos-scroll-container">
            <div className="productos-horizontal">
              {cartasExpandidas.map((carta) => {
                const yaComprada = estaCartaComprada(carta.cartaId);
                const seleccionada = productosSeleccionados.includes(
                  carta.cartaId
                );

                return (
                  <CartaProducto
                    key={carta.cartaId}
                    producto={carta.producto}
                    indice={carta.indice}
                    seleccionado={seleccionada}
                    yaComprado={yaComprada}
                    onToggle={() => onToggleProducto(carta.cartaId)}
                    disabled={
                      dineroJugador < carta.producto.costo && !seleccionada
                    }
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
            <span>💰 Tu dinero:</span>
            <span className="dinero-actual">${dineroJugador}</span>
          </div>
          <div className="resumen-item">
            <span>🛒 Costo total:</span>
            <span
              className={`costo-total ${!puedeConfirmar ? "insuficiente" : ""}`}
            >
              ${costoTotal}
            </span>
          </div>
          <div className="resumen-item">
            <span>📊 Restante:</span>
            <span
              className={`dinero-restante ${
                dineroRestante < 0 ? "negativo" : ""
              }`}
            >
              ${dineroRestante}
            </span>
          </div>
        </div>

        <div className="acciones-compra">
          <button className="btn-saltar" onClick={onSaltar}>
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
    </ModalShell>
  );
};

export default ModalCompraProductos;
