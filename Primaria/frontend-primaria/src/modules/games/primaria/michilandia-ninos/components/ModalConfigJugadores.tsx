import React from "react";
import type { PlayerSetup } from "./PlayerConfigurator";
import PlayerConfigurator from "./PlayerConfigurator";
import "./ModalConfigJugadores.css";

interface ModalConfigJugadoresProps {
  isOpen: boolean;
  playersSetup: PlayerSetup[];
  playersCount: number;
  onAddPlayer: () => void;
  onDecreasePlayers: () => void;
  onRemovePlayer: (index: number) => void;
  onNameChange: (index: number, value: string) => void;
  onSelectPresetColor: (index: number, presetIndex: number) => void;
  onCustomColor: (index: number, colorHex: string) => void;
  onStartSolo: () => void;
  onStartLocal: () => void;
  onClose: () => void;
}

const ModalConfigJugadores: React.FC<ModalConfigJugadoresProps> = ({
  isOpen,
  playersSetup,
  playersCount,
  onAddPlayer,
  onDecreasePlayers,
  onRemovePlayer,
  onNameChange,
  onSelectPresetColor,
  onCustomColor,
  onStartSolo,
  onStartLocal,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-config-overlay" onClick={onClose}>
      <div
        className="modal-config-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-config-header">
          <h2>⚙️ Configurar Jugadores</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-config-body">
          <PlayerConfigurator
            playersSetup={playersSetup}
            playersCount={playersCount}
            onAddPlayer={onAddPlayer}
            onDecreasePlayers={onDecreasePlayers}
            onRemovePlayer={onRemovePlayer}
            onNameChange={onNameChange}
            onSelectPresetColor={onSelectPresetColor}
            onCustomColor={onCustomColor}
          />
        </div>

        <div className="modal-config-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            ❌ Cancelar
          </button>
          <button className="modal-btn-solo" onClick={onStartSolo}>
            🎮 Jugar Solo
          </button>
          <button className="modal-btn-local" onClick={onStartLocal}>
            👥 Jugar Local ({playersCount} jugadores)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfigJugadores;
