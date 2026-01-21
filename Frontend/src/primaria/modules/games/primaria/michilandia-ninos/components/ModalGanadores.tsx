import React, { useMemo, useState } from "react";
import ModalShell from "./common/ModalShell";
import { Jugador } from "../hooks/types/juego.types";
import { NEGOCIOS, PRODUCTOS } from "../types";
import { calcularPatrimonioTotal } from "../hooks/utils/juego.utils";
import "./ModalGanadores.css";

type MotivoFin = "sin_dinero_cliente" | "abandono";

interface ModalGanadoresProps {
  jugadores: Jugador[];
  jugadoresRetirados: Jugador[];
  motivo: MotivoFin;
  onClose: () => void;
}

interface JugadorResumen extends Jugador {
  valorNegocios: number;
  valorProductos: number;
  patrimonio: number;
}

const fallbackFondo =
  "linear-gradient(135deg, #1f1c2c 0%, #928DAB 50%, #1f1c2c 100%)";

const ModalGanadores: React.FC<ModalGanadoresProps> = ({
  jugadores,
  jugadoresRetirados,
  motivo,
  onClose,
}) => {
  const [seleccionNegocio, setSeleccionNegocio] = useState<
    Record<number, string | null>
  >({});

  const resumenes: JugadorResumen[] = useMemo(() => {
    const combinados: Jugador[] = [
      ...jugadores,
      ...jugadoresRetirados.map((j) => ({ ...j, retirado: true })),
    ];

    return combinados
      .map((jugador) => {
        const { valorNegocios, valorProductos, patrimonio } =
          calcularPatrimonioTotal(jugador);

        return {
          ...jugador,
          valorNegocios,
          valorProductos,
          patrimonio,
        };
      })
      .sort((a, b) => b.patrimonio - a.patrimonio);
  }, [jugadores, jugadoresRetirados]);

  const getNombreNegocio = (id: string) => {
    const negocio = NEGOCIOS.find((n) => n.id === id);
    return negocio?.nombre || id;
  };

  const getProductoInfo = (id: string) => {
    const producto = PRODUCTOS.find((p) => p.id === id);
    return producto?.nombre || id;
  };

  const getProductosDeNegocio = (jugador: Jugador, negocioId: string) => {
    return jugador.productosComprados.filter(
      (p) => p.negocioId === negocioId && p.cantidad > 0
    );
  };

  const mensajeMotivo =
    motivo === "sin_dinero_cliente"
      ? "El cliente se quedó sin dinero. Se calcula el patrimonio final."
      : "La partida se finalizó. Aquí está el ranking.";

  return (
    <ModalShell
      overlayClassName="modal-ganadores-overlay"
      containerClassName="modal-ganadores-container"
      containerStyle={{ width: "min(1100px, 95vw)" }}
    >
      <div className="modal-ganadores-header">
        <div>
          <p className="ganadores-motivo">{mensajeMotivo}</p>
          <h2>Ranking de MichiLandia</h2>
          <p className="ganadores-sub">
            Dinero + valor de negocios + valor de productos
          </p>
        </div>
      </div>

      <div className="ganadores-body">
        {resumenes.map((jugador, idx) => {
          const retirado = jugador.retirado === true;
          const bordeColor = retirado ? "#7a7a7a" : jugador.color;
          const fondo = retirado
            ? "linear-gradient(135deg, #3c3c3c 0%, #2a2a2a 100%)"
            : jugador.colorFondo || fallbackFondo;

          const negocioSeleccionado =
            seleccionNegocio[jugador.id] ||
            jugador.negociosComprados[0] ||
            null;
          const productosDelNegocio = negocioSeleccionado
            ? getProductosDeNegocio(jugador, negocioSeleccionado)
            : [];
          const colorChip = retirado ? "#6b6b6b" : jugador.color;

          return (
            <div
              key={`${jugador.id}-${retirado ? "ret" : "act"}`}
              className={`ganador-card ${retirado ? "ganador-retirado" : ""}`}
              style={{ borderColor: bordeColor }}
            >
              <div className="ganador-rank">#{idx + 1}</div>
              <div className="ganador-top" style={{ background: fondo }}>
                <div className="ganador-identidad">
                  <span
                    className="ganador-color-dot"
                    style={{
                      backgroundColor: colorChip,
                      boxShadow: `0 0 0 2px ${bordeColor}`,
                    }}
                  />
                  <div>
                    <div className="ganador-nombre">{jugador.nombre}</div>
                    {retirado && <span className="tag-retirado">Retirado</span>}
                  </div>
                </div>
                <div className="ganador-total">
                  <span>Total</span>
                  <strong>${jugador.patrimonio}</strong>
                </div>
              </div>

              <div className="ganador-stats-row">
                <div className="stat-pill">
                  <span>Dinero</span>
                  <strong>${jugador.dinero}</strong>
                </div>
                <div className="stat-pill">
                  <span>Negocios</span>
                  <strong>
                    ${jugador.valorNegocios}
                    <small> ({jugador.negociosComprados.length})</small>
                  </strong>
                </div>
                <div className="stat-pill">
                  <span>Productos</span>
                  <strong>
                    ${jugador.valorProductos}
                    <small>
                      {" "}
                      (
                      {jugador.productosComprados.reduce(
                        (sum, p) => sum + p.cantidad,
                        0
                      )}
                      )
                    </small>
                  </strong>
                </div>
              </div>

              <div className="ganador-listados">
                <div className="negocios-list">
                  <p>Negocios</p>
                  {jugador.negociosComprados.length === 0 ? (
                    <span className="tag-vacio">Sin negocios</span>
                  ) : (
                    <div className="ganador-negocios-scroll">
                      {jugador.negociosComprados.map((id) => {
                        const activo = negocioSeleccionado === id;
                        return (
                          <button
                            key={id}
                            className={`negocio-pill ${activo ? "activo" : ""}`}
                            style={{ borderColor: bordeColor }}
                            onClick={() =>
                              setSeleccionNegocio((prev) => ({
                                ...prev,
                                [jugador.id]: id,
                              }))
                            }
                            title={getNombreNegocio(id)}
                          >
                            {getNombreNegocio(id)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {negocioSeleccionado && (
                    <div className="negocio-detalle">
                      <div className="negocio-detalle-header">
                        <span className="negocio-detalle-nombre">
                          {getNombreNegocio(negocioSeleccionado)}
                        </span>
                        <span className="negocio-detalle-badge">
                          {productosDelNegocio.reduce(
                            (sum, p) => sum + p.cantidad,
                            0
                          )}{" "}
                          prod.
                        </span>
                      </div>
                      {productosDelNegocio.length === 0 ? (
                        <div className="negocio-detalle-empty">
                          Sin productos en stock
                        </div>
                      ) : (
                        <div className="producto-grid">
                          {productosDelNegocio.map((prod) => (
                            <span
                              key={`${prod.productoId}-${prod.negocioId}`}
                              className="producto-chip"
                              title={`${getProductoInfo(
                                prod.productoId
                              )} · ${getNombreNegocio(prod.negocioId)}`}
                            >
                              {getProductoInfo(prod.productoId)} x
                              {prod.cantidad}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="productos-list">
                  <p>Inventario total</p>
                  {jugador.productosComprados.length === 0 ? (
                    <span className="tag-vacio">Sin productos</span>
                  ) : (
                    <div className="pill-grid">
                      {jugador.productosComprados.map((prod) => (
                        <span
                          key={`${prod.productoId}-${prod.negocioId}`}
                          className="pill pill-light"
                          title={`${getProductoInfo(
                            prod.productoId
                          )} · ${getNombreNegocio(prod.negocioId)}`}
                        >
                          {getProductoInfo(prod.productoId)} x{prod.cantidad}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ganadores-actions">
        <button className="btn-cerrar-ganadores" onClick={onClose}>
          Cerrar y volver al inicio
        </button>
      </div>
    </ModalShell>
  );
};

export default ModalGanadores;
