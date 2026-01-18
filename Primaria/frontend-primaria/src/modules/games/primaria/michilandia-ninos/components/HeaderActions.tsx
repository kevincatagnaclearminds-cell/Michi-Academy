import React from "react";
import type { Casilla } from "../types";

interface HeaderActionsProps {
  turnoNumero: number;
  casillaActual: Casilla;
  posicionCliente: number;
  onAbandonar: () => void;
  onFinalizar: () => void;
  onShowRules: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  turnoNumero,
  casillaActual,
  posicionCliente,
  onAbandonar,
  onFinalizar,
  onShowRules,
}) => {
  return (
    <div className="juego-header">
      <div className="juego-info">
        <span className="juego-turno">
          🎯 Vueltas del cliente: {turnoNumero}
        </span>
        <span className="casilla-actual-header">
          📍 {casillaActual.emoji} {casillaActual.nombre} (#{posicionCliente})
        </span>
      </div>
      <h1 className="juego-titulo">MichiLandia</h1>
      <div className="header-actions">
        <button
          className="btn-ayuda-circular"
          onClick={onShowRules}
          title="Ver reglas del juego"
        >
          ❓
        </button>
        <button
          className="btn-abandonar-header"
          onClick={onAbandonar}
          title="Abandonar partida"
        >
          🚪 Abandonar
        </button>
        <button
          className="btn-finalizar-header"
          onClick={onFinalizar}
          title="Finalizar partida"
        >
          🏁 Finalizar
        </button>
      </div>
    </div>
  );
};

export default HeaderActions;
