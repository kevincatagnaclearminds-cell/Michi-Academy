import React, { useState } from "react";
import Tablero from "./components/Tablero";
import Dado from "./components/Dados";
import ModalCompra from "./components/ModalCompra";
import ModalCompraProductos from "./components/ModalCompraProductos";
import ModalNegocioDetalle from "./components/ModalNegocioDetalle";
import ModalInstrucciones from "./components/ModalInstrucciones";
import ModalCartaIncognita from "./components/ModalCartaIncognita";
import { useJuego, COLORES_JUGADORES } from "./hooks/useJuego";
import { TABLERO, NEGOCIOS } from "./types";
import "./MichilandiaNinos.css";

const MichilandiaNinosPage = () => {
  const {
    estado,
    iniciarJuego,
    tirarDado,
    comprarNegocio,
    rechazarCompra,
    cerrarCartaIncognita,
    terminarTurno,
    toggleProductoSeleccionado,
    confirmarCompraProductos,
    saltarCompraProductos,
    puedesTirar,
    puedeTerminarTurno,
  } = useJuego();

  // Estado para el modal de detalle del negocio
  const [negocioDetalle, setNegocioDetalle] = useState<string | null>(null);

  // Estado para el modal de instrucciones
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  const casillaActual = TABLERO[estado.posicionCliente];
  const jugadorActual = estado.jugadores[estado.jugadorActual];

  // Obtener nombre del negocio por ID
  const getNombreNegocio = (id: string) => {
    const negocio = NEGOCIOS.find((n) => n.id === id);
    return negocio?.nombre || id;
  };

  // Pantalla de inicio
  if (estado.fase === "inicio") {
    return (
      <div className="michilandia-page">
        {/* Modal de instrucciones en inicio */}
        {mostrarInstrucciones && (
          <ModalInstrucciones onClose={() => setMostrarInstrucciones(false)} />
        )}

        <div className="michilandia-content">
          <img
            src="/images/ficha_michipolio.png"
            alt="Michi"
            className="michilandia-michi-img"
          />
          <h1 className="michilandia-title">MichiLandia</h1>
          <p className="michilandia-subtitle">Nivel Niños - Primaria</p>

          <div className="michilandia-card">
            <p>
              ¡Bienvenido a MichiLandia! Compra negocios y gana dinero cuando el
              cliente michi caiga en tus tiendas.
            </p>

            {/* Botón de ver instrucciones */}
            <button
              className="btn-ver-instrucciones"
              onClick={() => setMostrarInstrucciones(true)}
            >
              📖 Ver Reglas del Juego
            </button>

            <div className="michilandia-modos">
              <button
                className="michilandia-modo-btn modo-solo"
                onClick={() => iniciarJuego("solo")}
              >
                <span className="modo-icono">🎮</span>
                <span className="modo-titulo">Jugar Solo</span>
                <span className="modo-desc">Un jugador</span>
              </button>

              <button
                className="michilandia-modo-btn modo-local"
                onClick={() => iniciarJuego("local")}
              >
                <span className="modo-icono">👥</span>
                <span className="modo-titulo">Jugar Local</span>
                <span className="modo-desc">5 jugadores</span>
              </button>
            </div>

            <div className="michilandia-colores-preview">
              <p className="colores-titulo">Colores de jugadores:</p>
              <div className="colores-lista">
                {COLORES_JUGADORES.map((c, i) => (
                  <span
                    key={i}
                    className="color-badge"
                    style={{ background: c.color }}
                    title={c.nombre}
                  >
                    {c.emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del juego
  return (
    <div
      className="michilandia-juego"
      style={
        {
          "--jugador-color": jugadorActual?.color || "#4ECDC4",
          "--jugador-fondo":
            jugadorActual?.colorFondo ||
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        } as React.CSSProperties
      }
    >
      {/* Sistema de Notificaciones */}
      <div className="notificaciones-container">
        {estado.notificaciones.map((notif) => (
          <div
            key={notif.id}
            className={`notificacion notificacion-${notif.tipo}`}
          >
            {notif.mensaje}
          </div>
        ))}
      </div>

      {/* Notificación de movimiento */}
      {estado.fase === "moviendo" && (
        <div className="notificacion-movimiento">
          🐱 ¡Moviendo {estado.dado} casillas!
        </div>
      )}

      {/* Modal de compra de negocio */}
      {estado.fase === "comprando" && estado.negocioActual && (
        <ModalCompra
          negocio={estado.negocioActual}
          dineroJugador={jugadorActual?.dinero || 0}
          onComprar={comprarNegocio}
          onRechazar={rechazarCompra}
          jugadorNombre={jugadorActual?.nombre}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {/* Modal de compra de productos (después de comprar negocio) */}
      {estado.fase === "comprando_productos" && estado.negocioActual && (
        <ModalCompraProductos
          negocio={estado.negocioActual}
          dineroJugador={jugadorActual?.dinero || 0}
          productosSeleccionados={estado.productosSeleccionados}
          productosYaComprados={jugadorActual?.productosComprados || []}
          onToggleProducto={toggleProductoSeleccionado}
          onConfirmar={confirmarCompraProductos}
          onSaltar={saltarCompraProductos}
          jugadorNombre={jugadorActual?.nombre}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {/* Modal de detalle de negocio (con productos) */}
      {negocioDetalle && (
        <ModalNegocioDetalle
          negocioId={negocioDetalle}
          propietarioNombre={jugadorActual?.nombre || ""}
          propietarioColor={jugadorActual?.color || "#4ECDC4"}
          productosDelJugador={jugadorActual?.productosComprados || []}
          onClose={() => setNegocioDetalle(null)}
        />
      )}

      {/* Modal de instrucciones durante el juego */}
      {mostrarInstrucciones && (
        <ModalInstrucciones
          onClose={() => setMostrarInstrucciones(false)}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {/* Modal de carta incógnita */}
      {estado.fase === "carta_incognita" && estado.cartaIncognitaActual && (
        <ModalCartaIncognita
          carta={estado.cartaIncognitaActual}
          onCerrar={cerrarCartaIncognita}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {/* Header del juego */}
      <div className="juego-header">
        <div className="juego-info">
          <span className="juego-turno">🎯 Ronda: {estado.turnoNumero}</span>
          <div className="juego-dineros">
            <span className="juego-dinero-cliente" title="Dinero del Cliente">
              🐱 ${estado.dineroCliente}
            </span>
          </div>
        </div>
        <h1 className="juego-titulo">MichiLandia</h1>
        <div className="juego-casilla-info">
          <span className="casilla-actual">
            📍 {casillaActual.emoji} {casillaActual.nombre}
          </span>
          <button
            className="btn-ayuda-header"
            onClick={() => setMostrarInstrucciones(true)}
            title="Ver reglas del juego"
          >
            ❓
          </button>
        </div>
      </div>

      {/* Indicador de jugador actual */}
      <div
        className="jugador-actual-banner"
        style={{ background: jugadorActual?.colorFondo }}
      >
        <span className="jugador-emoji">{jugadorActual?.emoji}</span>
        <span className="jugador-nombre">{jugadorActual?.nombre}</span>
        <span className="jugador-dinero">💰 ${jugadorActual?.dinero}</span>
      </div>

      {/* Área principal del juego - NUEVO LAYOUT */}
      <div className="juego-main">
        {/* Panel izquierdo - Jugadores */}
        <div className="juego-panel-izquierdo">
          <div className="jugadores-lista">
            <h3>👥 Jugadores</h3>
            <div className="jugadores-grid">
              {estado.jugadores.map((jugador, idx) => (
                <div
                  key={jugador.id}
                  className={`jugador-card ${
                    idx === estado.jugadorActual ? "jugador-activo" : ""
                  }`}
                  style={{ borderColor: jugador.color }}
                >
                  <div
                    className="jugador-card-header"
                    style={{ background: jugador.colorFondo }}
                  >
                    <span className="jugador-card-emoji">{jugador.emoji}</span>
                    <span className="jugador-card-nombre">
                      {jugador.nombre}
                    </span>
                  </div>
                  <div className="jugador-card-body">
                    <span className="jugador-card-dinero">
                      💰 ${jugador.dinero}
                    </span>
                    <span className="jugador-card-negocios">
                      🏪 {jugador.negociosComprados.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Centro - Tablero */}
        <div className="juego-tablero">
          <Tablero posicionJugador={estado.posicionCliente} />
        </div>

        {/* Panel derecho */}
        <div className="juego-panel-derecho">
          {/* Dado y botón terminar turno */}
          <div className="panel-acciones">
            <Dado
              onTirar={tirarDado}
              disabled={!puedesTirar || estado.fase === "moviendo"}
            />

            {/* Botón terminar turno */}
            <button
              className="btn-terminar-turno"
              onClick={terminarTurno}
              disabled={!puedeTerminarTurno}
            >
              ⏭️ Terminar Turno
            </button>
          </div>

          {/* Negocios del jugador actual */}
          <div className="negocios-comprados">
            <h3>
              🏪 Negocios de {jugadorActual?.nombre} (
              {jugadorActual?.negociosComprados.length || 0})
            </h3>
            {jugadorActual?.negociosComprados.length === 0 ? (
              <p className="sin-negocios">Aún no tiene negocios</p>
            ) : (
              <div className="lista-negocios">
                {jugadorActual?.negociosComprados.map((id) => (
                  <button
                    key={id}
                    className="negocio-badge negocio-badge-clickable"
                    style={{ borderColor: jugadorActual.color }}
                    onClick={() => setNegocioDetalle(id)}
                    title="Click para ver detalles"
                  >
                    ✓ {getNombreNegocio(id)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="instrucciones">
            <h3>📋 Guía Rápida</h3>
            <ul>
              <li>🎲 Tira el dado para mover al cliente</li>
              <li>🏪 Compra negocios con tu dinero</li>
              <li>💰 Gana cuando el cliente visite tus tiendas</li>
              <li>⏭️ Presiona "Terminar Turno" al finalizar</li>
            </ul>
            <button
              className="btn-ver-reglas"
              onClick={() => setMostrarInstrucciones(true)}
            >
              📖 Ver Reglas Completas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MichilandiaNinosPage;
