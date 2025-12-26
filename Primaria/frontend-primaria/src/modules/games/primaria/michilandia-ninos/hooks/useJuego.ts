/**
 * Hook principal del juego MichiLandia
 *
 * Este hook orquesta toda la lógica del juego usando hooks especializados:
 * - useTurnos: Gestión de turnos
 * - useMovimiento: Dado y movimiento del cliente
 * - useNegocios: Compra de negocios
 * - useProductos: Compra de productos
 * - useCartasIncognita: Cartas sorpresa
 */

import { useState, useCallback } from "react";
import { EstadoJuego, ModoJuego, Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO, ESTADO_INICIAL } from "./constants/juego.constants";
import { crearJugadores, getCasilla } from "./utils/juego.utils";
import { useNotificaciones, MENSAJES } from "./useNotificaciones";

// Hooks especializados
import { useTurnos } from "./useTurnos";
import { useMovimiento } from "./useMovimiento";
import { useNegocios } from "./useNegocios";
import { useProductos } from "./useProductos";
import { useCartasIncognita } from "./useCartasIncognita";

// Re-exportar tipos y constantes para uso externo
export type {
  Jugador,
  Notificacion,
  ProductoComprado,
  FaseJuego,
  ModoJuego,
} from "./types/juego.types";
export { COLORES_JUGADORES } from "./constants/juego.constants";

export const useJuego = () => {
  const [estado, setEstado] = useState<EstadoJuego>(ESTADO_INICIAL);
  const { crearNotificacion, programarEliminacion } = useNotificaciones();

  // ====== NOTIFICACIONES ======

  const agregarNotificacion = useCallback(
    (mensaje: string, tipo: Notificacion["tipo"] = "info") => {
      const nuevaNotificacion = crearNotificacion(mensaje, tipo);

      setEstado((prev) => ({
        ...prev,
        notificaciones: [nuevaNotificacion, ...prev.notificaciones].slice(
          0,
          CONFIG_JUEGO.MAX_NOTIFICACIONES
        ),
      }));

      programarEliminacion(nuevaNotificacion.id, () => {
        setEstado((prev) => ({
          ...prev,
          notificaciones: prev.notificaciones.filter(
            (n) => n.id !== nuevaNotificacion.id
          ),
        }));
      });
    },
    [crearNotificacion, programarEliminacion]
  );

  // ====== HOOKS ESPECIALIZADOS ======

  const { terminarTurno } = useTurnos({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const { tirarDado } = useMovimiento({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const {
    comprarNegocio,
    rechazarCompra,
    esNegocioComprado,
    getNegocioPorCasilla,
    getPropietarioNegocio,
  } = useNegocios({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const {
    toggleProductoSeleccionado,
    confirmarCompraProductos,
    saltarCompraProductos,
    calcularCosto,
  } = useProductos({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const { cerrarCartaIncognita } = useCartasIncognita({
    estado,
    setEstado,
    agregarNotificacion,
  });

  // ====== INICIALIZACIÓN ======

  const iniciarJuego = useCallback(
    (modo: ModoJuego) => {
      const jugadores = crearJugadores(modo);

      setEstado({
        ...ESTADO_INICIAL,
        fase: "jugando",
        modoJuego: modo,
        jugadores,
      });

      setTimeout(() => {
        const primerJugador = jugadores[0];
        agregarNotificacion(
          MENSAJES.inicioJuego(primerJugador.emoji, primerJugador.nombre),
          "turno"
        );
      }, 500);
    },
    [agregarNotificacion]
  );

  // ====== GETTERS ======

  const getJugadorActual = useCallback(
    () => estado.jugadores[estado.jugadorActual],
    [estado.jugadores, estado.jugadorActual]
  );

  const getCasillaActual = useCallback(
    () => getCasilla(estado.posicionCliente),
    [estado.posicionCliente]
  );

  // ====== RETURN ======

  return {
    estado,
    // Inicialización
    iniciarJuego,
    // Turnos
    terminarTurno,
    // Movimiento
    tirarDado,
    // Negocios
    comprarNegocio,
    rechazarCompra,
    // Productos
    toggleProductoSeleccionado,
    confirmarCompraProductos,
    saltarCompraProductos,
    calcularCostoProductos: calcularCosto,
    // Cartas
    cerrarCartaIncognita,
    // Getters
    getJugadorActual,
    getCasillaActual,
    esNegocioComprado,
    getNegocioPorCasilla,
    getPropietarioNegocio,
    // Estados derivados
    puedesTirar: estado.fase === "jugando" && !estado.yaTiroDado,
    puedeTerminarTurno: estado.fase === "jugando" && estado.yaTiroDado,
  };
};
