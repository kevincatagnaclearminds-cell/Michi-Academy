import React from "react";
import ModalShell from "./common/ModalShell";
import CartaNegocio from "./CartaNegocio";
import { Jugador } from "../hooks/types/juego.types";
import { Negocio } from "../types";
import "./ModalSubasta.css";

interface ParticipanteVista {
  jugador: Jugador;
  monto: number;
  estado: "activo" | "retirado";
  esTurno: boolean;
  esLider: boolean;
}

interface ModalSubastaProps {
  negocio: Negocio;
  participantes: ParticipanteVista[];
  jugadorEnTurno: Jugador;
  pujaActual: number;
  liderNombre?: string;
  onPujar5: () => void;
  onPujar10: () => void;
  onPujar25: () => void;
  onRetirarse: () => void;
}

const ModalSubasta: React.FC<ModalSubastaProps> = ({
  negocio,
  participantes,
  jugadorEnTurno,
  pujaActual,
  liderNombre,
  onPujar5,
  onPujar10,
  onPujar25,
  onRetirarse,
}) => {
  const precioInicial = Math.floor(negocio.precio * 0.5);
  const headerColor = jugadorEnTurno.colorFondo || jugadorEnTurno.color;
  const bordeColor = jugadorEnTurno.color || "#4ecdc4";

  return (
    <ModalShell
      overlayClassName="modal-subasta-overlay"
      containerClassName="modal-subasta-container"
      containerStyle={{
        borderColor: `${bordeColor}80`,
        boxShadow: `0 22px 70px rgba(0,0,0,0.6), 0 0 0 2px ${bordeColor}30`,
      }}
    >
      <div
        className="modal-subasta-header"
        style={{ background: headerColor || undefined }}
      >
        <div>
          <div className="subasta-turno-row">
            <span
              className="subasta-color-dot"
              style={{ backgroundColor: jugadorEnTurno.color }}
            />
            <p className="subasta-turno">Turno de {jugadorEnTurno.nombre}</p>
          </div>
          <h2>Subasta del negocio</h2>
          <p className="subasta-negocio">{negocio.nombre}</p>
        </div>
        <div className="subasta-bid-info">
          <span>Puja actual</span>
          <strong>${pujaActual}</strong>
          <small className="subasta-precio-base">
            Precio inicial (50%): ${precioInicial}
          </small>
          {liderNombre && <small>Líder: {liderNombre}</small>}
        </div>
      </div>

      <div className="modal-subasta-body">
        <div className="subasta-participantes">
          <h3>Jugadores</h3>
          <div className="subasta-participantes-list">
            {participantes.map((p) => (
              <div
                key={p.jugador.id}
                className={`subasta-card ${p.esTurno ? "en-turno" : ""} ${
                  p.estado === "retirado" ? "retirado" : ""
                }`}
                style={{
                  borderColor:
                    p.estado === "retirado" ? "#888" : p.jugador.color,
                }}
              >
                <div className="subasta-card-header">
                  <div
                    className="subasta-color"
                    style={{
                      background:
                        p.estado === "retirado" ? "#666" : p.jugador.color,
                    }}
                  />
                  <span className="subasta-nombre">{p.jugador.nombre}</span>
                  {p.esLider && p.estado === "activo" && (
                    <span className="subasta-lider">Líder</span>
                  )}
                  {p.estado === "retirado" && (
                    <span className="subasta-retirado">Retirado</span>
                  )}
                </div>
                <div className="subasta-card-body">
                  <span className="subasta-monto">Puja: ${p.monto}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="subasta-negocio-panel">
          <CartaNegocio negocioId={negocio.id} revelada size="medium" />
          <div className="subasta-acciones">
            <button className="btn-puja" onClick={onPujar5}>
              +5
            </button>
            <button className="btn-puja" onClick={onPujar10}>
              +10
            </button>
            <button className="btn-puja" onClick={onPujar25}>
              +25
            </button>
            <button className="btn-retirarse" onClick={onRetirarse}>
              Retirarse
            </button>
          </div>
          <div className="subasta-dinero">
            <span>Dinero disponible:</span>
            <strong>${jugadorEnTurno.dinero}</strong>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default ModalSubasta;
