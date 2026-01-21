import React from "react";

interface InicioScreenProps {
  onShowConfig: () => void;
  onShowRules: () => void;
}

const InicioScreen: React.FC<InicioScreenProps> = ({
  onShowConfig,
  onShowRules,
}) => {
  return (
    <div className="michilandia-page">
      <div className="michilandia-content-single">
        <div className="michilandia-hero-centered">
          <div className="hero-header">
            <img
              src="/images/ficha_michipolio.png"
              alt="Michi"
              className="michilandia-michi-img"
            />
            <div className="hero-titles">
              <h1 className="michilandia-title">MichiLandia</h1>
              <p className="michilandia-subtitle">Nivel Niños - Primaria</p>
            </div>
          </div>

          <p className="michilandia-copy">
            ¡Bienvenido a MichiLandia! Compra negocios y gana dinero cuando el
            cliente michi caiga en tus tiendas.
          </p>

          <div className="michilandia-actions-centered">
            <button className="btn-ver-instrucciones" onClick={onShowRules}>
              📖 Ver Reglas del Juego
            </button>

            <button className="btn-jugar-principal" onClick={onShowConfig}>
              🎮 Jugar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioScreen;
