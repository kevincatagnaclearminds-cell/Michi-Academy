import React from "react";
import { PRODUCTOS } from "../types";
import type { Jugador, ClienteLocoEnCurso } from "../hooks/types/juego.types";
import "./ModalClienteLoco.css";

interface ModalClienteLocoProps {
  clienteLocoEnCurso: ClienteLocoEnCurso;
  jugadores: Jugador[];
  productosSeleccionados: string[];
  onToggleProducto: (productoId: string) => void;
  onConfirmar: () => void;
  onSaltar: () => void;
  dineroCliente: number;
}

const ModalClienteLoco: React.FC<ModalClienteLocoProps> = ({
  clienteLocoEnCurso,
  jugadores,
  productosSeleccionados,
  onToggleProducto,
  onConfirmar,
  onSaltar,
  dineroCliente,
}) => {
  const negocioActual =
    clienteLocoEnCurso.negociosConDueno[clienteLocoEnCurso.negocioIndex];
  const propietario = jugadores[negocioActual.propietarioIndex];

  // Obtener productos del propietario para este negocio
  const productosDisponibles = propietario.productosComprados
    .filter((p) => p.negocioId === negocioActual.negocioId && p.cantidad > 0)
    .map((pc) => {
      const producto = PRODUCTOS.find((p) => p.id === pc.productoId);
      return producto ? { ...producto, cantidadDisponible: pc.cantidad } : null;
    })
    .filter((p) => p !== null);

  const productoSeleccionado = productosSeleccionados[0];
  const producto = PRODUCTOS.find((p) => p.id === productoSeleccionado);
  const puedeComprar = producto ? dineroCliente >= producto.precio : false;

  return (
    <div className="modal-cliente-loco-overlay">
      <div
        className="modal-cliente-loco-container"
        style={{
          borderColor: propietario.color,
          boxShadow: `0 0 30px ${propietario.color}66, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="modal-cliente-loco-header"
          style={{ background: propietario.colorFondo }}
        >
          <h2>🤪 ¡Cliente Loco!</h2>
          <p>
            Turno de <strong>{propietario.nombre}</strong>
          </p>
          <div className="progreso-cliente-loco">
            <span>
              Negocio {clienteLocoEnCurso.negocioIndex + 1} de{" "}
              {clienteLocoEnCurso.negociosConDueno.length}
            </span>
          </div>
        </div>

        <div className="modal-cliente-loco-content">
          <div className="mensaje-cliente-loco">
            <p>
              El cliente visita tu negocio y quiere comprar{" "}
              <strong>1 producto</strong>. Elige cuál vender:
            </p>
          </div>

          <div className="info-dinero-cliente">
            <span className="label">💰 Dinero del cliente:</span>
            <span className="valor">${dineroCliente}</span>
          </div>

          {productosDisponibles.length === 0 ? (
            <div className="sin-productos">
              <p>😿 No tienes productos en stock en este negocio</p>
              <button
                className="btn-saltar"
                onClick={onConfirmar}
                style={{
                  background: propietario.colorFondo,
                  borderColor: propietario.color,
                }}
              >
                Saltar
              </button>
            </div>
          ) : (
            <>
              <div className="productos-grid">
                {productosDisponibles.map((prod) => {
                  if (!prod) return null;
                  const seleccionado = productosSeleccionados.includes(prod.id);
                  const sinDinero = dineroCliente < prod.precio;

                  return (
                    <div
                      key={prod.id}
                      className={`producto-card ${
                        seleccionado ? "seleccionado" : ""
                      } ${sinDinero ? "sin-dinero" : ""}`}
                      onClick={() => !sinDinero && onToggleProducto(prod.id)}
                      style={{
                        borderColor: seleccionado
                          ? propietario.color
                          : "transparent",
                      }}
                    >
                      <div className="producto-nombre">{prod.nombre}</div>
                      <div className="producto-info">
                        <span className="precio">${prod.precio}</span>
                        <span className="stock">
                          Stock: {prod.cantidadDisponible}
                        </span>
                      </div>
                      {sinDinero && (
                        <div className="etiqueta-sin-dinero">Sin dinero</div>
                      )}
                      {seleccionado && (
                        <div className="check-seleccionado">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="modal-cliente-loco-footer">
                <button
                  className="btn-saltar"
                  onClick={onSaltar}
                  style={{
                    background: "rgba(150, 150, 150, 0.3)",
                    borderColor: "rgba(150, 150, 150, 0.5)",
                  }}
                >
                  ⏭️ Saltar
                </button>
                <button
                  className="btn-confirmar"
                  onClick={onConfirmar}
                  disabled={
                    productosSeleccionados.length === 0 || !puedeComprar
                  }
                  style={{
                    background:
                      productosSeleccionados.length > 0 && puedeComprar
                        ? propietario.colorFondo
                        : "rgba(100, 100, 100, 0.5)",
                    borderColor:
                      productosSeleccionados.length > 0 && puedeComprar
                        ? propietario.color
                        : "rgba(150, 150, 150, 0.5)",
                  }}
                >
                  {productosSeleccionados.length === 0
                    ? "Selecciona 1 producto"
                    : `Vender por $${producto?.precio || 0}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalClienteLoco;
