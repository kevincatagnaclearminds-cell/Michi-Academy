import React from "react";
import type { Jugador } from "../hooks/types/juego.types";

interface PlayersPanelProps {
  jugadores: Jugador[];
  jugadorActualIndex: number;
}

const PlayersPanel: React.FC<PlayersPanelProps> = ({
  jugadores,
  jugadorActualIndex,
}) => {
  return (
    <div className="juego-panel-izquierdo">
      <div className="jugadores-lista">
        <h3>👥 Jugadores</h3>
        <div className="jugadores-grid">
          {jugadores.map((jugador, idx) => (
            <div
              key={jugador.id}
              className={`jugador-card ${
                idx === jugadorActualIndex ? "jugador-activo" : ""
              } ${idx === 0 ? "jugador-principal" : ""}`}
              style={
                {
                  borderColor: jugador.color,
                  "--card-color": jugador.colorFondo || jugador.color,
                } as React.CSSProperties
              }
            >
              <div className="jugador-card-compact">
                <div className="jugador-card-title">
                  <div
                    className="jugador-color-circle"
                    style={{ background: jugador.color }}
                    title={jugador.nombre}
                  />
                  <span className="jugador-card-nombre">{jugador.nombre}</span>
                </div>
                <div className="jugador-card-stats">
                  <div className="stat">
                    <span className="stat-emoji">💰</span>
                    <span className="stat-value">${jugador.dinero}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-emoji">🏪</span>
                    <span className="stat-value">
                      {jugador.negociosComprados.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayersPanel;
