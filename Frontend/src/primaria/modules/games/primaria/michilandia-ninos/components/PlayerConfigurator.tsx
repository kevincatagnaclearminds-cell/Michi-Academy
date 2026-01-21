import React from "react";
import { COLORES_JUGADORES } from "../hooks/useJuego";

export type PlayerSetup = {
  nombre: string;
  color: string;
  colorFondo: string;
  emoji: string;
};

interface PlayerConfiguratorProps {
  playersSetup: PlayerSetup[];
  playersCount: number;
  onAddPlayer: () => void;
  onRemovePlayer: (index: number) => void;
  onNameChange: (index: number, value: string) => void;
  onSelectPresetColor: (index: number, presetIndex: number) => void;
  onCustomColor: (index: number, colorHex: string) => void;
  onDecreasePlayers: () => void;
}

const PlayerConfigurator: React.FC<PlayerConfiguratorProps> = ({
  playersSetup,
  playersCount,
  onAddPlayer,
  onRemovePlayer,
  onNameChange,
  onSelectPresetColor,
  onCustomColor,
  onDecreasePlayers,
}) => {
  return (
    <div className="michilandia-config-jugadores">
      <div className="config-top-row">
        <p className="config-titulo">Configurar Jugadores</p>
        <div className="players-count-control">
          <button onClick={onDecreasePlayers} className="count-btn">
            −
          </button>
          <span className="count-label">{playersCount}</span>
          <button
            onClick={() => {
              if (playersCount < 5) onAddPlayer();
            }}
            className="count-btn"
          >
            +
          </button>
        </div>
      </div>

      <div className="config-grid">
        {playersSetup.slice(0, playersCount).map((p, i) => {
          const usedColors = playersSetup
            .slice(0, playersCount)
            .map((pp, idx) => (idx === i ? null : pp.color))
            .filter(Boolean) as string[];

          return (
            <div key={i} className="player-config-card">
              <div className="player-config-header">
                <label>Nombre</label>
                <div className="player-actions">
                  <button
                    className="remove-player-btn"
                    onClick={() => onRemovePlayer(i)}
                    title="Eliminar jugador"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <input
                value={p.nombre}
                onChange={(e) => onNameChange(i, e.target.value)}
              />

              <div className="color-options visible">
                {COLORES_JUGADORES.map((c, ci) => {
                  const alreadyUsed = usedColors.includes(c.color);
                  return (
                    <button
                      key={ci}
                      className={`color-swatch ${
                        p.color === c.color ? "selected" : ""
                      } ${alreadyUsed ? "disabled" : ""}`}
                      style={{ background: c.color }}
                      onClick={() => {
                        if (!alreadyUsed) onSelectPresetColor(i, ci);
                      }}
                      title={c.nombre}
                      aria-disabled={alreadyUsed}
                    />
                  );
                })}

                <div className="custom-color">
                  <input
                    type="color"
                    value={p.color}
                    onChange={(e) => onCustomColor(i, e.target.value)}
                    aria-label={`Color personalizado jugador ${i + 1}`}
                  />
                  <span className="color-hex">{p.color.toUpperCase()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerConfigurator;
