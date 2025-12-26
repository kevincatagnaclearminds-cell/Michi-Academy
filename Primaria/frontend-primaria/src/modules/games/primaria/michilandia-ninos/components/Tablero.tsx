import React from "react";
import "./Tablero.css";

interface TableroProps {
  posicionJugador: number;
}

// Coordenadas de cada casilla en porcentaje (x, y) sobre la imagen del tablero
// Esquinas ~10%, casillas normales distribuidas entre 21% y 79%
const POSICIONES_CASILLAS: { [key: number]: { x: number; y: number } } = {
  // === ESQUINA INFERIOR IZQUIERDA (RECARGAR) - Posición 0 ===
  0: { x: 6.5, y: 93.5 },

  // === LADO IZQUIERDO (de abajo hacia arriba) - Posiciones 1-5 ===
  1: { x: 6.5, y: 80 }, // Marisquería
  2: { x: 6.5, y: 65 }, // Carnicería
  3: { x: 6.5, y: 50 }, // Evento Michi (?)
  4: { x: 6.5, y: 34.5 }, // Granos y Cereales
  5: { x: 6.5, y: 20 }, // Frutiverdura

  // === ESQUINA SUPERIOR IZQUIERDA (INICIO) - Posición 6 ===
  6: { x: 6.5, y: 6.45 },

  // === LADO SUPERIOR (de izquierda a derecha) - Posiciones 7-11 ===
  7: { x: 20.4, y: 6.45 }, // Panadería
  8: { x: 35, y: 6.45 }, // Pizzería
  9: { x: 50, y: 6.45 }, // Evento Michi (helado)
  10: { x: 65.2, y: 6.45 }, // Heladería
  11: { x: 79.6, y: 6.45 }, // Comida Rápida

  // === ESQUINA SUPERIOR DERECHA (META) - Posición 12 ===
  12: { x: 93.5, y: 6.45 },

  // === LADO DERECHO (de arriba hacia abajo) - Posiciones 13-17 ===
  13: { x: 93.5, y: 20 }, // Celulares
  14: { x: 93.5, y: 34.5 }, // Tecnología
  15: { x: 93.5, y: 50 }, // Evento Michi
  16: { x: 93.5, y: 65 }, // Juguetería
  17: { x: 93.5, y: 80 }, // Papelería

  // === ESQUINA INFERIOR DERECHA (INVERTIR) - Posición 18 ===
  18: { x: 93.3, y: 93.5 },

  // === LADO INFERIOR (de derecha a izquierda) - Posiciones 19-23 ===
  19: { x: 79.8, y: 93.5 }, // Tienda de Mascotas
  20: { x: 65.5, y: 93.5 }, // Ferretería
  21: { x: 50, y: 93.5 }, // Evento Michi (?)
  22: { x: 35, y: 93.5 }, // Tienda de Ropa
  23: { x: 20.5, y: 93.5 }, // Farmacia
};

const Tablero: React.FC<TableroProps> = ({ posicionJugador }) => {
  const posicion = POSICIONES_CASILLAS[posicionJugador] || { x: 10, y: 90 };

  return (
    <div className="tablero-imagen-container">
      <img
        src="/images/michipolio_tablero.jpg"
        alt="Tablero MichiLandia"
        className="tablero-imagen"
      />

      {/* Ficha del jugador posicionada sobre el tablero */}
      <div
        className="jugador-ficha-tablero"
        style={{
          left: `${posicion.x}%`,
          top: `${posicion.y}%`,
        }}
      >
        <div className="ficha-circulo">
          <img
            src="/images/ficha_michipolio.png"
            alt="Ficha Michi"
            className="ficha-imagen"
          />
        </div>
      </div>
    </div>
  );
};

export default Tablero;
