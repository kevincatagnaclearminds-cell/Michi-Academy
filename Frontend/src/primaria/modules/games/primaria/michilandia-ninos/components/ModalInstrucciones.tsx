import React, { useState } from "react";
import "./ModalInstrucciones.css";

interface ModalInstruccionesProps {
  onClose: () => void;
  jugadorColor?: string;
  jugadorColorFondo?: string;
}

type SeccionInstrucciones =
  | "objetivo"
  | "preparacion"
  | "como_jugar"
  | "casillas"
  | "fin"
  | "consejos";

const ModalInstrucciones: React.FC<ModalInstruccionesProps> = ({
  onClose,
  jugadorColor = "#4ECDC4",
  jugadorColorFondo = "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
}) => {
  const [seccionActiva, setSeccionActiva] = useState<SeccionInstrucciones>("objetivo");

  const secciones: { id: SeccionInstrucciones; titulo: string; emoji: string }[] = [
    { id: "objetivo", titulo: "Objetivo", emoji: "🏆" },
    { id: "preparacion", titulo: "Preparación", emoji: "📋" },
    { id: "como_jugar", titulo: "Cómo Jugar", emoji: "🎮" },
    { id: "casillas", titulo: "Casillas", emoji: "🗺️" },
    { id: "fin", titulo: "Fin del Juego", emoji: "🏁" },
    { id: "consejos", titulo: "Consejos", emoji: "💡" },
  ];

  const renderContenido = () => {
    switch (seccionActiva) {
      case "objetivo":
        return (
          <div className="instrucciones-seccion">
            <h3>🏆 Objetivo del Juego</h3>
            <div className="objetivo-destacado">
              <p>
                <strong>Gana quien termine el juego con más dinero y patrimonio total:</strong>
              </p>
              <ul className="lista-patrimonio">
                <li>💵 Efectivo (MichiDólares)</li>
                <li>🏪 Valor de tus negocios</li>
                <li>📦 Valor de tus productos (precio de costo)</li>
              </ul>
            </div>
            <div className="tip-box">
              <span className="tip-emoji">💡</span>
              <p>¡Sé el Gran Empresario de MichiLandia acumulando la mayor riqueza!</p>
            </div>
          </div>
        );

      case "preparacion":
        return (
          <div className="instrucciones-seccion">
            <h3>📋 Preparación del Juego</h3>
            
            <div className="prep-item">
              <h4>🏦 El Banquero</h4>
              <p>
                Maneja el dinero del banco y del Cliente. Entrega billetes, cobra
                compras y da el dinero de recarga.
              </p>
            </div>

            <div className="prep-item">
              <h4>🐱 El Cliente</h4>
              <p>
                En MichiLandia solo existe <strong>una ficha: el Cliente</strong>.
                Es quien recorre el tablero comprando productos. Todos los jugadores
                mueven al mismo Cliente.
              </p>
            </div>

            <div className="dinero-inicial">
              <h4>💰 Dinero Inicial</h4>
              <div className="dinero-grid">
                <div className="dinero-card">
                  <span className="dinero-quien">👤 Cada Jugador</span>
                  <span className="dinero-cantidad">$1,000</span>
                  <span className="dinero-detalle">MichiDólares</span>
                </div>
                <div className="dinero-card cliente">
                  <span className="dinero-quien">🐱 El Cliente</span>
                  <span className="dinero-cantidad">$1,500</span>
                  <span className="dinero-detalle">MichiDólares</span>
                </div>
              </div>
            </div>

            <div className="prep-item">
              <h4>🎲 ¿Quién empieza?</h4>
              <p>
                El jugador que saque el número más alto con el dado. Se juega en
                sentido de las agujas del reloj (hacia la derecha).
              </p>
            </div>
          </div>
        );

      case "como_jugar":
        return (
          <div className="instrucciones-seccion">
            <h3>🎮 Cómo se Juega</h3>

            <div className="turno-pasos">
              <div className="paso">
                <span className="paso-numero">1</span>
                <div className="paso-contenido">
                  <h4>🎲 Lanza el dado</h4>
                  <p>Mueve al Cliente según el número que salga.</p>
                </div>
              </div>

              <div className="paso">
                <span className="paso-numero">2</span>
                <div className="paso-contenido">
                  <h4>🏪 Negocio con dueño</h4>
                  <p>
                    El Cliente compra <strong>obligatoriamente 3 productos</strong> de
                    ese negocio. El dueño elige qué productos vender y recibe el dinero.
                  </p>
                  <p className="nota-importante">
                    ⚠️ Si el dueño no tiene 3 productos, ¡pierde la venta!
                  </p>
                </div>
              </div>

              <div className="paso">
                <span className="paso-numero">3</span>
                <div className="paso-contenido">
                  <h4>🏬 Negocio vacío</h4>
                  <p>El jugador que movió al Cliente puede:</p>
                  <ul>
                    <li>✅ <strong>Comprar el negocio</strong> (paga al banco el precio de la tarjeta)</li>
                    <li>📦 <strong>Comprar productos</strong> para su negocio</li>
                    <li>❌ <strong>No comprar</strong> → El banco lo subasta a mitad de precio</li>
                  </ul>
                </div>
              </div>

              <div className="paso">
                <span className="paso-numero">4</span>
                <div className="paso-contenido">
                  <h4>⏭️ Termina tu turno</h4>
                  <p>Presiona el botón "Terminar Turno" para pasar al siguiente jugador.</p>
                </div>
              </div>
            </div>

            <div className="warning-box">
              <span className="warning-emoji">⚠️</span>
              <p>
                <strong>¡Importante!</strong> Si no compras productos para tu negocio,
                abrirá vacío y no podrás vender hasta reabastecerte.
              </p>
            </div>
          </div>
        );

      case "casillas":
        return (
          <div className="instrucciones-seccion">
            <h3>🗺️ Casillas Especiales</h3>

            <div className="casillas-grid">
              <div className="casilla-card recarga">
                <div className="casilla-icono">🏦</div>
                <div className="casilla-info">
                  <h4>RECARGA / Banco MichiLandia</h4>
                  <p>
                    El Cliente recibe <strong>$100</strong> del banco cada vez que
                    pasa por esta casilla.
                  </p>
                </div>
              </div>

              <div className="casilla-card invertir">
                <div className="casilla-icono">📈</div>
                <div className="casilla-info">
                  <h4>INVERTIR</h4>
                  <p>
                    <strong>Todos los jugadores</strong> pueden comprar más productos
                    para sus negocios.
                  </p>
                </div>
              </div>

              <div className="casilla-card sorpresa">
                <div className="casilla-icono">❓</div>
                <div className="casilla-info">
                  <h4>ACCIÓN SORPRESA</h4>
                  <p>
                    Toma una carta del mazo y sigue las instrucciones.
                    ¡Puede ser bueno o malo!
                  </p>
                </div>
              </div>

              <div className="casilla-card negocio">
                <div className="casilla-icono">🏪</div>
                <div className="casilla-info">
                  <h4>NEGOCIOS</h4>
                  <p>
                    Marisquería, Carnicería, Frutería, Panadería, y muchos más.
                    ¡Compra y hazte dueño!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "fin":
        return (
          <div className="instrucciones-seccion">
            <h3>🏁 Fin del Juego</h3>

            <div className="fin-condicion">
              <span className="fin-emoji">💸</span>
              <p>
                El juego termina cuando <strong>el Cliente se queda sin dinero</strong>.
              </p>
            </div>

            <div className="calculo-final">
              <h4>📊 Cálculo del Patrimonio Final</h4>
              <p>Cada jugador suma:</p>
              <div className="suma-items">
                <div className="suma-item">
                  <span>💵</span>
                  <span>Su dinero en efectivo</span>
                </div>
                <div className="suma-operador">+</div>
                <div className="suma-item">
                  <span>🏪</span>
                  <span>Valor de sus negocios</span>
                </div>
                <div className="suma-operador">+</div>
                <div className="suma-item">
                  <span>📦</span>
                  <span>Valor de productos (costo)</span>
                </div>
                <div className="suma-operador">=</div>
                <div className="suma-total">
                  <span>🏆</span>
                  <span>PATRIMONIO TOTAL</span>
                </div>
              </div>
            </div>

            <div className="ganador-box">
              <span className="corona">👑</span>
              <p>
                El jugador con el <strong>mayor patrimonio total</strong> gana
                y se convierte en el <strong>Gran Empresario de MichiLandia</strong>
              </p>
            </div>
          </div>
        );

      case "consejos":
        return (
          <div className="instrucciones-seccion">
            <h3>💡 Consejos Rápidos</h3>

            <div className="consejos-lista">
              <div className="consejo">
                <span className="consejo-icono">🏪</span>
                <div className="consejo-texto">
                  <h4>Compra negocios temprano</h4>
                  <p>
                    Mientras más pronto tengas negocios, más oportunidades de
                    vender cuando el Cliente pase.
                  </p>
                </div>
              </div>

              <div className="consejo">
                <span className="consejo-icono">📦</span>
                <div className="consejo-texto">
                  <h4>Mantén siempre productos</h4>
                  <p>
                    Sin productos no puedes vender. Asegúrate de tener al menos
                    3 productos en cada negocio.
                  </p>
                </div>
              </div>

              <div className="consejo">
                <span className="consejo-icono">🎯</span>
                <div className="consejo-texto">
                  <h4>Vende con estrategia</h4>
                  <p>
                    Cuando el Cliente llegue a tu negocio, elige sabiamente qué
                    productos vender para maximizar ganancias.
                  </p>
                </div>
              </div>

              <div className="consejo alerta">
                <span className="consejo-icono">⚠️</span>
                <div className="consejo-texto">
                  <h4>¡Cuidado con el inventario!</h4>
                  <p>
                    Si te quedas sin productos cuando el Cliente llega,
                    <strong> ¡pierdes la venta!</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-instrucciones-overlay" onClick={onClose}>
      <div
        className="modal-instrucciones-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: jugadorColor,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 3px ${jugadorColor}60`,
        }}
      >
        <div
          className="modal-instrucciones-header"
          style={{ background: jugadorColorFondo }}
        >
          <h2>📖 Reglas de MichiLandia</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-instrucciones-body">
          {/* Navegación de secciones */}
          <nav className="instrucciones-nav">
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                className={`nav-btn ${seccionActiva === seccion.id ? "activo" : ""}`}
                onClick={() => setSeccionActiva(seccion.id)}
                style={
                  seccionActiva === seccion.id
                    ? { background: jugadorColorFondo, borderColor: jugadorColor }
                    : {}
                }
              >
                <span className="nav-emoji">{seccion.emoji}</span>
                <span className="nav-titulo">{seccion.titulo}</span>
              </button>
            ))}
          </nav>

          {/* Contenido de la sección */}
          <div className="instrucciones-contenido">{renderContenido()}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalInstrucciones;

