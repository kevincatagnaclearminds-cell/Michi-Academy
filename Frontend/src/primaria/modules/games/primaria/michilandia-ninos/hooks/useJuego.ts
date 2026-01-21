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

import { useState, useCallback, useEffect } from "react";
import { EstadoJuego, ModoJuego, Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO, ESTADO_INICIAL } from "./constants/juego.constants";
import { crearJugadores, getCasilla } from "./utils/juego.utils";
import { useNotificaciones, MENSAJES } from "./useNotificaciones";
import { useAbandonarJuego } from "./useAbandonarJuego";
import { useFinalizarPartida } from "./useFinalizarPartida";

// Hooks especializados
import { useTurnos } from "./useTurnos";
import { useMovimiento } from "./useMovimiento";
import { useNegocios } from "./useNegocios";
import { useProductos } from "./useProductos";
import { useCartasIncognita } from "./useCartasIncognita";
import { useVentas } from "./useVentas";
import { useInversion } from "./useInversion";
import { useClienteLoco } from "./useClienteLoco";
import { useSubasta } from "./useSubasta";
import { ModalGanadoresState } from "./types/juego.types";

// Re-exportar tipos y constantes para uso externo
export type {
  Jugador,
  Notificacion,
  ProductoComprado,
  FaseJuego,
  ModoJuego,
  VentaEnCurso,
  InversionEnCurso,
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

  // ====== MODALES INFORMATIVOS ======

  const cerrarModalProductosInsuficientes = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      modalProductosInsuficientes: null,
      fase: "jugando",
    }));
  }, []);

  const cerrarModalNegocioNoComprado = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      modalNegocioNoComprado: null,
      negocioActual: null,
      // Volver a fase jugando - NO puede comprar
      fase: "jugando",
    }));
  }, []);

  const cerrarModalProductoNoDisponible = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      modalProductoNoDisponible: null,
      fase: "jugando",
    }));
  }, []);

  const cerrarModalCompraAutomatica = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      modalCompraAutomatica: null,
    }));
  }, []);

  const cerrarModalCompraForzada = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      modalCompraForzada: null,
    }));
  }, []);

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
    rechazarCompra: rechazarCompraBase,
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

  const {
    toggleProductoParaVender,
    confirmarVenta,
    cancelarVenta,
    calcularGananciaVenta,
  } = useVentas({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const {
    iniciarFaseInversion,
    confirmarCompraInversion,
    saltarCompraInversion,
    toggleProductoInversion,
  } = useInversion({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const {
    toggleProductoClienteLoco,
    confirmarVentaClienteLoco,
    saltarClienteLoco,
  } = useClienteLoco({
    estado,
    setEstado,
    agregarNotificacion,
  });

  const { iniciarSubasta, pujar, retirarse, cerrarSubasta } = useSubasta({
    estado,
    setEstado,
    agregarNotificacion,
  });

  // ====== INICIALIZACIÓN ======

  const iniciarJuego = useCallback(
    (
      modo: ModoJuego,
      configuracionJugadores?:
        | {
            nombre?: string;
            color?: string;
            colorFondo?: string;
            emoji?: string;
          }[]
    ) => {
      const jugadores = crearJugadores(modo, configuracionJugadores);

      setEstado({
        ...ESTADO_INICIAL,
        fase: "jugando",
        modoJuego: modo,
        jugadores,
        jugadoresRetirados: [],
        modalGanadores: null,
      });

      setTimeout(() => {
        const primerJugador = jugadores[0];
        agregarNotificacion(
          MENSAJES.inicioJuego(primerJugador.nombre, primerJugador.color),
          "turno"
        );
      }, 500);
    },
    [agregarNotificacion]
  );

  const abandonarJuego = useAbandonarJuego(setEstado, agregarNotificacion);
  const finalizarPartida = useFinalizarPartida(setEstado, agregarNotificacion);

  const mostrarResumenFinal = useCallback(
    (motivo: ModalGanadoresState["motivo"]) => {
      setEstado((prev) => ({
        ...prev,
        fase: "fin_partida",
        ventaEnCurso: null,
        inversionEnCurso: null,
        clienteLocoEnCurso: null,
        subastaEnCurso: null,
        modalGanadores: { motivo },
      }));
    },
    []
  );

  const cerrarModalGanadores = useCallback(() => {
    setEstado(ESTADO_INICIAL);
  }, []);

  useEffect(() => {
    if (estado.dineroCliente <= 0 && !estado.modalGanadores) {
      mostrarResumenFinal("sin_dinero_cliente");
      agregarNotificacion(
        "El cliente se quedó sin dinero. Se calculan los ganadores.",
        "alerta"
      );
    }
  }, [
    estado.dineroCliente,
    estado.modalGanadores,
    mostrarResumenFinal,
    agregarNotificacion,
  ]);

  // ====== GETTERS ======

  const getJugadorActual = useCallback(
    () => estado.jugadores[estado.jugadorActual],
    [estado.jugadores, estado.jugadorActual]
  );

  const getCasillaActual = useCallback(
    () => getCasilla(estado.posicionCliente),
    [estado.posicionCliente]
  );

  const rechazarCompra = useCallback(() => {
    const negocioId = estado.negocioActual?.id;
    if (negocioId) {
      iniciarSubasta(negocioId, estado.jugadorActual);
    } else {
      rechazarCompraBase();
    }
  }, [
    estado.negocioActual,
    estado.jugadorActual,
    iniciarSubasta,
    rechazarCompraBase,
  ]);

  // ====== RETURN ======

  return {
    estado,
    // Inicialización
    iniciarJuego,
    // Control de partida
    abandonarJuego,
    finalizarPartida,
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
    // Ventas (cliente compra a dueño)
    toggleProductoParaVender,
    confirmarVenta,
    cancelarVenta,
    calcularGananciaVenta,
    // Inversión (jugadores compran productos para sus negocios)
    iniciarFaseInversion,
    confirmarCompraInversion,
    saltarCompraInversion,
    toggleProductoInversion,
    // Cliente Loco
    toggleProductoClienteLoco,
    confirmarVentaClienteLoco,
    saltarClienteLoco,
    // Cartas
    cerrarCartaIncognita,
    // Subasta
    iniciarSubasta,
    pujarSubasta: pujar,
    retirarseSubasta: retirarse,
    cerrarSubasta,
    // Modales informativos
    cerrarModalProductosInsuficientes,
    cerrarModalNegocioNoComprado,
    cerrarModalProductoNoDisponible,
    cerrarModalCompraAutomatica,
    cerrarModalCompraForzada,
    cerrarModalGanadores,
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
