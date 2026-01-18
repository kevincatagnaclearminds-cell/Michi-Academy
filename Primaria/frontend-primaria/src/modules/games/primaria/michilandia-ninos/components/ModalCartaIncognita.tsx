import React, { useState, useEffect } from "react";
import { CartaIncognita, CARTA_TRASERA } from "../types";
import "./ModalCartaIncognita.css";

interface ModalCartaIncognitaProps {
  carta: CartaIncognita;
  onCerrar: () => void;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

// Ruta base de las imágenes de cartas incógnitas
const RUTA_CARTAS = "/src/modules/games/primaria/michilandia-ninos/assets/cartas/incognitas/";

const ModalCartaIncognita: React.FC<ModalCartaIncognitaProps> = ({
  carta,
  onCerrar,
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  const [animando, setAnimando] = useState(true);
  const [mostrarContenido, setMostrarContenido] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer1 = setTimeout(() => {
      setAnimando(false);
    }, 800);

    const timer2 = setTimeout(() => {
      setMostrarContenido(true);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="modal-carta-overlay">
      <div className="modal-carta-container">
        {/* Carta con flip */}
        <div className={`carta-incognita ${animando ? "carta-animando" : "carta-revelada"}`}>
          {/* Parte trasera de la carta */}
          <div className="carta-trasera">
            <img 
              src={`${RUTA_CARTAS}${CARTA_TRASERA}`} 
              alt="Carta Incógnita"
              className="carta-imagen"
            />
          </div>

          {/* Parte frontal de la carta (imagen real) */}
          <div className="carta-frontal">
            <img 
              src={`${RUTA_CARTAS}${carta.imagen}`} 
              alt={carta.titulo}
              className="carta-imagen"
            />
          </div>
        </div>

        {/* Botón cerrar - aparece después de la animación */}
        {mostrarContenido && (
          <button
            className="btn-cerrar-carta"
            onClick={onCerrar}
            style={{
              background: jugadorColorFondo,
              borderColor: jugadorColor,
            }}
          >
            ✓ Entendido
          </button>
        )}

        {/* Decoración de fondo */}
        <div className="carta-decoracion">
          <span className="deco-1">✨</span>
          <span className="deco-2">🌟</span>
          <span className="deco-3">⭐</span>
          <span className="deco-4">💫</span>
        </div>
      </div>
    </div>
  );
};

export default ModalCartaIncognita;
