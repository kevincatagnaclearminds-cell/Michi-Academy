import React from "react";
import Dado from "./Dados";
import type { Jugador } from "../hooks/types/juego.types";
import type { Casilla } from "../types";

interface RightPanelProps {
  dineroCliente: number;
  jugadorActual: Jugador;
  casillaActual: Casilla;
  posicionCliente: number;
  onTirarDado: (resultado: number) => void;
  disableDado: boolean;
  onTerminarTurno: () => void;
  puedeTerminarTurno: boolean;
  onOpenNegocio: (id: string) => void;
  getNombreNegocio: (id: string) => string;
}

const RightPanel: React.FC<RightPanelProps> = ({
  dineroCliente,
  jugadorActual,
  casillaActual,
  posicionCliente,
  onTirarDado,
  disableDado,
  onTerminarTurno,
  puedeTerminarTurno,
  onOpenNegocio,
  getNombreNegocio,
}) => {
  return (
    <div className="juego-panel-derecho">
      <div className="cliente-dinero-card">
        <div className="cliente-dinero-block">
          <h3>🐱 Dinero del cliente</h3>
          <span className="cliente-dinero">$ {dineroCliente}</span>
        </div>
      </div>

      <div className="panel-acciones">
        <Dado onTirar={onTirarDado} disabled={disableDado} />
        <button
          className="btn-terminar-turno"
          onClick={onTerminarTurno}
          disabled={!puedeTerminarTurno}
        >
          ⏭️ Terminar Turno
        </button>
      </div>

      <div className="jugador-en-turno-card">
        <div className="jugador-turno-header">
          <h4>🎲 Jugador en turno</h4>
        </div>
        <div className="jugador-card-info">
          <div className="jugador-card-title">
            <span className="jugador-card-nombre">{jugadorActual?.nombre}</span>
          </div>
          <div className="jugador-card-stats">
            <div className="stat">
              <span className="stat-emoji">💰</span>
              <span className="stat-value">${jugadorActual?.dinero}</span>
            </div>
            <div className="stat">
              <span className="stat-emoji">🏪</span>
              <span className="stat-value">
                {jugadorActual?.negociosComprados.length || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="jugador-card-negocios">
          {jugadorActual?.negociosComprados.length === 0 ? (
            <div className="jugador-no-negocios">🚫 Sin negocios</div>
          ) : (
            <div className="jugador-negocios-scroll">
              {jugadorActual?.negociosComprados.map((nid) => (
                <button
                  key={nid}
                  className="jugador-negocio-pill"
                  style={{ borderColor: jugadorActual.color }}
                  onClick={() => onOpenNegocio(nid)}
                  title={getNombreNegocio(nid)}
                >
                  {getNombreNegocio(nid)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
