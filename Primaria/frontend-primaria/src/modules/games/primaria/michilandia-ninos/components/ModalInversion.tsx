import React, { useState } from "react";
import {
  NEGOCIOS,
  Producto,
  getProductosPorNegocio,
  getImagenProducto,
} from "../types";
import { Jugador, InversionEnCurso } from "../hooks/useJuego";
import { extraerProductoIdDeCartaId } from "../hooks/utils/juego.utils";
import ModalShell from "./common/ModalShell";
import {
  getProductoImagenUrl,
  getProductoReversoUrl,
} from "./utils/productImages";
import { CartaExpandida, expandirCartasProducto } from "./utils/productCards";
import CartaNegocio from "./CartaNegocio";
import "./ModalCompraProductos.css";
import "./ModalInversion.css";

interface ModalInversionProps {
  inversionEnCurso: InversionEnCurso;
  jugadores: Jugador[];
  productosSeleccionados: string[];
  onToggleProducto: (productoId: string) => void;
  onConfirmar: () => void;
  onSaltar: () => void;
}

interface CartaProductoInversionProps {
  producto: Producto;
  indice: number;
  seleccionado: boolean;
  yaComprado: boolean;
  onToggle: () => void;
  disabled: boolean;
}

const CartaProductoInversion: React.FC<CartaProductoInversionProps> = ({
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

  return (
    <div
      className={`carta-producto-container ${
        seleccionado ? "seleccionada" : ""
      } ${yaComprado ? "ya-comprada" : ""}`}
      onMouseEnter={() => !yaComprado && setRevelada(true)}
      onMouseLeave={() => !yaComprado && !seleccionado && setRevelada(false)}
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

      <div className="carta-producto-info">
        <span className="producto-nombre">{producto.nombre}</span>
        <span className="producto-costo">💵 Costo: ${producto.costo}</span>
      </div>

      {yaComprado ? (
        <button className="btn-producto btn-ya-comprado" disabled>
          ✓ Tienes
        </button>
      ) : (
        <button
          className={`btn-producto ${
            seleccionado ? "btn-quitar" : "btn-agregar"
          }`}
          onClick={onToggle}
          disabled={disabled && !seleccionado}
        >
          {seleccionado ? "✗ Quitar" : "🛒 Comprar"}
        </button>
      )}
    </div>
  );
};

const ModalInversion: React.FC<ModalInversionProps> = ({
  inversionEnCurso,
  jugadores,
  productosSeleccionados,
  onToggleProducto,
  onConfirmar,
  onSaltar,
}) => {
  const { jugadorInvirtiendoIndex, negocioIndex, negociosRestantes } =
    inversionEnCurso;
  const jugadorActual = jugadores[jugadorInvirtiendoIndex];
  const negocioActual = negociosRestantes[negocioIndex];
  const negocio = NEGOCIOS.find((n) => n.id === negocioActual.negocioId);

  if (!negocio || !jugadorActual) return null;

  const productosDelNegocio = getProductosPorNegocio(negocio.id);
  const cartasExpandidas: CartaExpandida[] =
    expandirCartasProducto(productosDelNegocio);

  // Calcular costo total
  const costoTotal = productosSeleccionados.reduce((total, cartaId) => {
    const productoId = extraerProductoIdDeCartaId(cartaId);
    const producto = productosDelNegocio.find((p) => p.id === productoId);
    return total + (producto?.costo || 0);
  }, 0);

  const puedeConfirmar = jugadorActual.dinero >= costoTotal;
  const dineroRestante = jugadorActual.dinero - costoTotal;

  // Verificar si una carta ya está comprada por el jugador
  const estaCartaComprada = (cartaId: string): boolean => {
    const productoId = extraerProductoIdDeCartaId(cartaId);
    const partes = cartaId.split("_");
    const indice = parseInt(partes[partes.length - 1]);
    const comprado = jugadorActual.productosComprados.find(
      (p) => p.productoId === productoId && p.negocioId === negocio.id
    );
    return comprado ? indice < comprado.cantidad : false;
  };

  // Calcular progreso
  const negocioActualNum = negocioIndex + 1;
  const totalNegocios = negociosRestantes.length;

  return (
    <ModalShell
      overlayClassName="modal-inversion-overlay"
      containerClassName="modal-productos-container modal-inversion-container"
      containerStyle={{
        borderColor: jugadorActual.color,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 4px ${jugadorActual.color}80`,
      }}
      overlayExtras={
        <>
          {/* Fondo con el color del jugador */}
          <div
            className="modal-inversion-bg"
            style={{ background: jugadorActual.colorFondo }}
          />

          {/* Indicador de turno arriba */}
          <div className="inversion-turno-indicator">
            <div
              className="inversion-turno-header"
              style={{ background: jugadorActual.colorFondo }}
            >
              <div className="inversion-turno-text">
                <h3>💰 Fase de Inversión</h3>
                <p>
                  <strong>{jugadorActual.nombre}</strong> está invirtiendo
                </p>
              </div>
              <div className="inversion-progreso">
                <span>
                  Negocio {negocioActualNum} de {totalNegocios}
                </span>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="inversion-instrucciones">
              <p>
                🎯 Compra productos para tu negocio{" "}
                <strong>{negocio.nombre}</strong>
              </p>
              <p>
                💡 Los productos te permiten vender al cliente cuando pase por
                tu negocio
              </p>
            </div>
          </div>
        </>
      }
    >
      {/* Header */}
      <div
        className="modal-productos-header"
        style={{ background: jugadorActual.colorFondo }}
      >
        <h2>🛍️ Compra de Productos - Inversión</h2>
        <p>
          <strong>{jugadorActual.nombre}</strong> - {negocio.nombre}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="modal-productos-content">
        {/* Lado izquierdo - Carta del negocio */}
        <div className="modal-productos-negocio">
          <h3>Tu Negocio</h3>
          <CartaNegocio negocioId={negocio.id} revelada={true} size="medium" />
          <div className="negocio-info">
            <span className="negocio-nombre">{negocio.nombre}</span>
          </div>
        </div>

        {/* Lado derecho - Productos */}
        <div className="modal-productos-lista">
          <h3>📦 Productos Disponibles</h3>
          <p className="productos-instruccion">
            Pasa el cursor sobre las cartas para revelarlas y selecciona los
            productos que deseas comprar para tu negocio.
          </p>

          <div className="productos-scroll-container">
            <div className="productos-horizontal">
              {cartasExpandidas.map((carta) => {
                const yaComprada = estaCartaComprada(carta.cartaId);
                const seleccionada = productosSeleccionados.includes(
                  carta.cartaId
                );

                return (
                  <CartaProductoInversion
                    key={carta.cartaId}
                    producto={carta.producto}
                    indice={carta.indice}
                    seleccionado={seleccionada}
                    yaComprado={yaComprada}
                    onToggle={() => onToggleProducto(carta.cartaId)}
                    disabled={
                      jugadorActual.dinero < carta.producto.costo &&
                      !seleccionada
                    }
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
            <span className="dinero-actual">${jugadorActual.dinero}</span>
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
            ⏭️ No Invertir
          </button>
          <button
            className="btn-confirmar"
            onClick={onConfirmar}
            disabled={!puedeConfirmar || productosSeleccionados.length === 0}
            style={{
              background:
                puedeConfirmar && productosSeleccionados.length > 0
                  ? `linear-gradient(135deg, ${jugadorActual.color} 0%, ${jugadorActual.color}cc 100%)`
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

export default ModalInversion;
