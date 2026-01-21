import React, { useEffect, useRef, useState } from "react";
import Tablero from "./components/Tablero";
import InicioScreen from "./components/InicioScreen";
import PlayersPanel from "./components/PlayersPanel";
import RightPanel from "./components/RightPanel";
import HeaderActions from "./components/HeaderActions";
import GameModals from "./components/GameModals";
import ModalConfigJugadores from "./components/ModalConfigJugadores";
import { useJuego, COLORES_JUGADORES } from "./hooks/useJuego";
import type { Jugador } from "./hooks/types/juego.types";
import { TABLERO, NEGOCIOS } from "./types";
import type { Casilla } from "./types";
import "./styles/variables.css";
import "./styles/inicio.css";
import "./styles/game.css";

type PlayerSetup = {
  nombre: string;
  color: string;
  colorFondo: string;
  emoji: string;
};

const MichilandiaNinosPage: React.FC = () => {
  const {
    estado,
    iniciarJuego,
    abandonarJuego,
    finalizarPartida,
    tirarDado,
    comprarNegocio,
    rechazarCompra,
    cerrarCartaIncognita,
    terminarTurno,
    toggleProductoSeleccionado,
    confirmarCompraProductos,
    saltarCompraProductos,
    toggleProductoParaVender,
    confirmarVenta,
    cancelarVenta,
    iniciarFaseInversion,
    confirmarCompraInversion,
    saltarCompraInversion,
    toggleProductoInversion,
    toggleProductoClienteLoco,
    confirmarVentaClienteLoco,
    saltarClienteLoco,
    cerrarModalProductosInsuficientes,
    cerrarModalNegocioNoComprado,
    cerrarModalProductoNoDisponible,
    cerrarModalCompraAutomatica,
    cerrarModalCompraForzada,
    cerrarModalGanadores,
    pujarSubasta,
    retirarseSubasta,
    puedesTirar,
    puedeTerminarTurno,
  } = useJuego();

  const [mostrarModalAbandonar, setMostrarModalAbandonar] = useState(false);
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);
  const [negocioDetalle, setNegocioDetalle] = useState<string | null>(null);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);
  const [mostrarConfigJugadores, setMostrarConfigJugadores] = useState(false);

  const [playersSetup, setPlayersSetup] = useState<PlayerSetup[]>(() =>
    COLORES_JUGADORES.slice(0, 5).map((c, i) => ({
      nombre: `Jugador ${i + 1}`,
      color: c.color,
      colorFondo: c.colorFondo,
      emoji: c.emoji,
    }))
  );
  const [playersCount, setPlayersCount] = useState<number>(5);

  const inversionIniciada = useRef(false);

  const casillaActual: Casilla = TABLERO[estado.posicionCliente];
  const jugadorActual: Jugador = estado.jugadores[estado.jugadorActual];

  const generateGradientFromColor = (hex: string) => {
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    const dark1 = `rgb(${Math.max(0, r - 40)}, ${Math.max(
      0,
      g - 40
    )}, ${Math.max(0, b - 40)})`;
    const dark2 = `rgb(${Math.max(0, r - 20)}, ${Math.max(
      0,
      g - 20
    )}, ${Math.max(0, b - 20)})`;
    return `linear-gradient(135deg, ${dark1} 0%, ${dark2} 50%, ${hex} 100%)`;
  };

  const handleCustomColor = (index: number, colorHex: string) => {
    setPlayersSetup((prev) => {
      const usedColors = prev
        .map((pp, idx) => (idx === index ? null : pp.color))
        .filter(Boolean) as string[];
      if (usedColors.includes(colorHex)) return prev;
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        color: colorHex,
        colorFondo: generateGradientFromColor(colorHex),
      };
      return copy;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setPlayersSetup((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], nombre: value };
      return copy;
    });
  };

  const handleSelectColor = (index: number, colorIndex: number) => {
    const col = COLORES_JUGADORES[colorIndex];
    setPlayersSetup((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        color: col.color,
        colorFondo: col.colorFondo,
        emoji: col.emoji,
      };
      return copy;
    });
  };

  const addPlayer = () => {
    setPlayersSetup((prev) => {
      if (prev.length >= 5) return prev;
      const nextIndex = prev.length;
      const preset = COLORES_JUGADORES[nextIndex % COLORES_JUGADORES.length];
      return [
        ...prev,
        {
          nombre: `Jugador ${nextIndex + 1}`,
          color: preset.color,
          colorFondo: preset.colorFondo,
          emoji: preset.emoji,
        },
      ];
    });
    setPlayersCount((c) => Math.min(5, c + 1));
  };

  const removePlayer = (index: number) => {
    setPlayersSetup((prev) => {
      if (prev.length <= 1) return prev;
      const copy = prev.filter((_, i) => i !== index).map((p) => ({ ...p }));
      return copy;
    });
    setPlayersCount((c) => Math.max(1, c - 1));
  };

  const decreasePlayers = () => {
    if (playersCount <= 1) return;
    setPlayersCount((p) => p - 1);
    setPlayersSetup((s) => s.slice(0, Math.max(1, s.length - 1)));
  };

  useEffect(() => {
    if (
      estado.fase === "invirtiendo" &&
      !estado.inversionEnCurso &&
      !inversionIniciada.current
    ) {
      inversionIniciada.current = true;
      iniciarFaseInversion();
    }
    if (estado.fase !== "invirtiendo") {
      inversionIniciada.current = false;
    }
  }, [estado.fase, estado.inversionEnCurso, iniciarFaseInversion]);

  const getNombreNegocio = (id: string) => {
    const negocio = NEGOCIOS.find((n) => n.id === id);
    return negocio?.nombre || id;
  };

  const handleStartSolo = () => {
    const cfg = playersSetup.slice(0, playersCount).map((p, i) => ({
      ...p,
      nombre: p.nombre || (i === 0 ? "Tú" : `Jugador ${i + 1}`),
    }));
    setMostrarConfigJugadores(false);
    iniciarJuego("solo", cfg);
  };

  const handleStartLocal = () => {
    setMostrarConfigJugadores(false);
    iniciarJuego("local", playersSetup.slice(0, playersCount));
  };

  if (estado.fase === "inicio") {
    return (
      <>
        {mostrarInstrucciones && (
          <GameModals
            estado={estado}
            jugadorActual={estado.jugadores[0] as Jugador}
            negocioDetalle={null}
            mostrarInstrucciones={mostrarInstrucciones}
            mostrarModalAbandonar={false}
            mostrarModalFinalizar={false}
            dineroCliente={estado.dineroCliente}
            onCloseNegocio={() => undefined}
            onSetMostrarInstrucciones={setMostrarInstrucciones}
            onConfirmAbandonar={() => undefined}
            onCancelAbandonar={() => undefined}
            onConfirmFinalizar={() => undefined}
            onCancelFinalizar={() => undefined}
            onComprarNegocio={() => undefined}
            onRechazarCompra={() => undefined}
            onToggleProductoSeleccionado={() => undefined}
            onConfirmarCompraProductos={() => undefined}
            onSaltarCompraProductos={() => undefined}
            onToggleProductoParaVender={() => undefined}
            onConfirmarVenta={() => undefined}
            onCancelarVenta={() => undefined}
            onToggleProductoInversion={() => undefined}
            onConfirmarInversion={() => undefined}
            onSaltarInversion={() => undefined}
            onToggleProductoClienteLoco={() => undefined}
            onConfirmarVentaClienteLoco={() => undefined}
            onSaltarClienteLoco={() => undefined}
            cerrarCartaIncognita={() => undefined}
            cerrarModalProductosInsuficientes={() => undefined}
            cerrarModalNegocioNoComprado={() => undefined}
            cerrarModalProductoNoDisponible={() => undefined}
            cerrarModalCompraAutomatica={() => undefined}
            cerrarModalCompraForzada={() => undefined}
            onCerrarGanadores={() => undefined}
            onPujarSubasta={() => undefined}
            onRetirarseSubasta={() => undefined}
          />
        )}

        <ModalConfigJugadores
          isOpen={mostrarConfigJugadores}
          playersSetup={playersSetup}
          playersCount={playersCount}
          onAddPlayer={addPlayer}
          onDecreasePlayers={decreasePlayers}
          onRemovePlayer={removePlayer}
          onNameChange={handleNameChange}
          onSelectPresetColor={handleSelectColor}
          onCustomColor={handleCustomColor}
          onStartSolo={handleStartSolo}
          onStartLocal={handleStartLocal}
          onClose={() => setMostrarConfigJugadores(false)}
        />

        <InicioScreen
          onShowConfig={() => setMostrarConfigJugadores(true)}
          onShowRules={() => setMostrarInstrucciones(true)}
        />
      </>
    );
  }

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
      <div className="notificaciones-container">
        {estado.notificaciones.map((notif) => {
          const colorMatch = notif.mensaje.match(
            /\s*\((#(?:[0-9a-fA-F]{3}|[0-9A-Fa-f]{6}))\)/
          );
          const displayMessage = colorMatch
            ? notif.mensaje.replace(colorMatch[0], "")
            : notif.mensaje;
          return (
            <div
              key={notif.id}
              className={`notificacion notificacion-${notif.tipo}`}
            >
              {colorMatch && (
                <span
                  className="notif-color-dot"
                  style={{ background: colorMatch[1] }}
                  aria-hidden
                />
              )}
              <span className="notificacion-text">{displayMessage}</span>
            </div>
          );
        })}
      </div>

      {estado.fase === "moviendo" && (
        <div className="notificacion-movimiento">
          🐱 ¡Moviendo {estado.dado} casillas!
        </div>
      )}

      <GameModals
        estado={estado}
        jugadorActual={jugadorActual as Jugador}
        negocioDetalle={negocioDetalle}
        mostrarInstrucciones={mostrarInstrucciones}
        mostrarModalAbandonar={mostrarModalAbandonar}
        mostrarModalFinalizar={mostrarModalFinalizar}
        dineroCliente={estado.dineroCliente}
        onCloseNegocio={() => setNegocioDetalle(null)}
        onSetMostrarInstrucciones={setMostrarInstrucciones}
        onConfirmAbandonar={() => {
          abandonarJuego();
          setMostrarModalAbandonar(false);
        }}
        onCancelAbandonar={() => setMostrarModalAbandonar(false)}
        onConfirmFinalizar={() => {
          finalizarPartida();
          setMostrarModalFinalizar(false);
        }}
        onCancelFinalizar={() => setMostrarModalFinalizar(false)}
        onComprarNegocio={comprarNegocio}
        onRechazarCompra={rechazarCompra}
        onToggleProductoSeleccionado={toggleProductoSeleccionado}
        onConfirmarCompraProductos={confirmarCompraProductos}
        onSaltarCompraProductos={saltarCompraProductos}
        onToggleProductoParaVender={toggleProductoParaVender}
        onConfirmarVenta={confirmarVenta}
        onCancelarVenta={cancelarVenta}
        onToggleProductoInversion={toggleProductoInversion}
        onConfirmarInversion={confirmarCompraInversion}
        onSaltarInversion={saltarCompraInversion}
        onToggleProductoClienteLoco={toggleProductoClienteLoco}
        onConfirmarVentaClienteLoco={confirmarVentaClienteLoco}
        onSaltarClienteLoco={saltarClienteLoco}
        cerrarCartaIncognita={cerrarCartaIncognita}
        cerrarModalProductosInsuficientes={cerrarModalProductosInsuficientes}
        cerrarModalNegocioNoComprado={cerrarModalNegocioNoComprado}
        cerrarModalProductoNoDisponible={cerrarModalProductoNoDisponible}
        cerrarModalCompraAutomatica={cerrarModalCompraAutomatica}
        cerrarModalCompraForzada={cerrarModalCompraForzada}
        onCerrarGanadores={cerrarModalGanadores}
        onPujarSubasta={pujarSubasta}
        onRetirarseSubasta={retirarseSubasta}
      />

      <HeaderActions
        turnoNumero={estado.turnoNumero}
        casillaActual={casillaActual}
        posicionCliente={estado.posicionCliente}
        onAbandonar={() => setMostrarModalAbandonar(true)}
        onFinalizar={() => setMostrarModalFinalizar(true)}
        onShowRules={() => setMostrarInstrucciones(true)}
      />

      <div className="juego-main">
        <PlayersPanel
          jugadores={estado.jugadores as Jugador[]}
          jugadorActualIndex={estado.jugadorActual}
        />

        <div className="juego-tablero">
          <Tablero
            posicionJugador={estado.posicionCliente}
            jugadores={estado.jugadores}
          />
        </div>

        <RightPanel
          dineroCliente={estado.dineroCliente}
          jugadorActual={jugadorActual}
          casillaActual={casillaActual}
          posicionCliente={estado.posicionCliente}
          onTirarDado={tirarDado}
          disableDado={!puedesTirar || estado.fase === "moviendo"}
          onTerminarTurno={terminarTurno}
          puedeTerminarTurno={puedeTerminarTurno}
          onOpenNegocio={setNegocioDetalle}
          getNombreNegocio={getNombreNegocio}
        />
      </div>
    </div>
  );
};

export default MichilandiaNinosPage;
