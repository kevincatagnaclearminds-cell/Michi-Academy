import React, { useState, useEffect } from "react";
import CartaNegocio from "./CartaNegocio";
import ModalShell from "./common/ModalShell";
import { Negocio } from "../types";
import "./ModalCompra.css";

interface ModalCompraProps {
  negocio: Negocio;
  dineroJugador: number;
  onComprar: () => void;
  onRechazar: () => void;
  jugadorNombre?: string;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

const ModalCompra: React.FC<ModalCompraProps> = ({
  negocio,
  dineroJugador,
  onComprar,
  onRechazar,
  jugadorNombre = "Jugador",
  jugadorColor = "#4ECDC4",
  jugadorColorFondo,
}) => {
  const [cartaRevelada, setCartaRevelada] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const puedeComprar = dineroJugador >= negocio.precio;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCartaRevelada(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cartaRevelada) {
      const timer = setTimeout(() => {
        setMostrarOpciones(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [cartaRevelada]);

  // Usar el colorFondo del jugador o crear uno basado en el color
  const headerBackground =
    jugadorColorFondo ||
    `linear-gradient(135deg, ${jugadorColor} 0%, ${jugadorColor}cc 100%)`;

  return (
    <ModalShell
      overlayClassName="modal-compra-overlay"
      containerClassName="modal-compra-container"
      containerStyle={{
        borderColor: jugadorColor,
        boxShadow: `0 0 30px ${jugadorColor}66, 0 20px 60px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        className="modal-compra-header"
        style={{ background: headerBackground }}
      >
        <h2>🏪 ¡Negocio Disponible!</h2>
        <p>
          Turno de <strong>{jugadorNombre}</strong>
        </p>
      </div>

      <div className="modal-compra-content">
        <div className="modal-carta-container">
          <CartaNegocio
            negocioId={negocio.id}
            revelada={cartaRevelada}
            size="large"
          />
        </div>

        {mostrarOpciones && (
          <div className="modal-compra-info">
            <h3>{negocio.nombre}</h3>

            <div className="modal-precio-container">
              <span className="modal-precio-label">Precio:</span>
              <span className="modal-precio-valor">💰 ${negocio.precio}</span>
            </div>

            <div className="modal-dinero-container">
              <span className="modal-dinero-label">Tu dinero:</span>
              <span
                className={`modal-dinero-valor ${
                  !puedeComprar ? "dinero-insuficiente" : ""
                }`}
              >
                🏦 ${dineroJugador}
              </span>
            </div>

            {!puedeComprar && (
              <div className="modal-advertencia">
                ⚠️ No tienes suficiente dinero
              </div>
            )}

            <div className="modal-compra-acciones">
              <button
                className="btn-comprar"
                onClick={onComprar}
                disabled={!puedeComprar}
                style={{
                  background: puedeComprar
                    ? `linear-gradient(135deg, ${jugadorColor} 0%, ${jugadorColor}cc 100%)`
                    : undefined,
                  boxShadow: puedeComprar
                    ? `0 4px 15px ${jugadorColor}66`
                    : undefined,
                }}
              >
                ✓ COMPRAR
              </button>
              <button className="btn-subastar" onClick={onRechazar}>
                ✘ RECHAZAR COMPRA
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default ModalCompra;
