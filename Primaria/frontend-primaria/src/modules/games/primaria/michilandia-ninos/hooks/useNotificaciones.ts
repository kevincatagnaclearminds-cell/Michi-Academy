// ====== HOOK DE NOTIFICACIONES ======

import { useCallback, useRef } from "react";
import { Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO } from "./constants/juego.constants";

interface UseNotificacionesReturn {
  crearNotificacion: (
    mensaje: string,
    tipo?: Notificacion["tipo"]
  ) => Notificacion;
  programarEliminacion: (id: number, callback: () => void) => void;
}

/**
 * Hook para crear y manejar notificaciones del juego
 */
export const useNotificaciones = (): UseNotificacionesReturn => {
  const contadorId = useRef(0);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  /**
   * Crea una nueva notificación con ID único
   */
  const crearNotificacion = useCallback(
    (mensaje: string, tipo: Notificacion["tipo"] = "info"): Notificacion => {
      return {
        id: ++contadorId.current,
        mensaje,
        tipo,
        timestamp: Date.now(),
      };
    },
    []
  );

  /**
   * Programa la eliminación automática de una notificación
   */
  const programarEliminacion = useCallback(
    (id: number, callback: () => void) => {
      // Limpiar timeout previo si existe
      const timeoutPrevio = timeoutsRef.current.get(id);
      if (timeoutPrevio) {
        clearTimeout(timeoutPrevio);
      }

      // Programar nueva eliminación
      const nuevoTimeout = setTimeout(() => {
        callback();
        timeoutsRef.current.delete(id);
      }, CONFIG_JUEGO.DURACION_NOTIFICACION);

      timeoutsRef.current.set(id, nuevoTimeout);
    },
    []
  );

  return {
    crearNotificacion,
    programarEliminacion,
  };
};

// ====== MENSAJES PREDEFINIDOS ======

export const MENSAJES = {
  // Juego
  inicioJuego: (nombre: string, color?: string) =>
    `🎮 ¡Comienza el juego! ${nombre}${color ? ` (${color})` : ""} empieza`,

  cambioTurno: (nombre: string, color?: string) =>
    `🔄 Turno de ${nombre}${color ? ` (${color})` : ""}`,

  finTurno: (nombre: string, color?: string) =>
    `⏭️ ${nombre}${color ? ` (${color})` : ""} terminó su turno`,

  // Dado
  tiroDado: (nombre: string, color: string | undefined, resultado: number) =>
    `🎲 ${nombre}${color ? ` (${color})` : ""} lanzó el dado: ¡${resultado}!`,

  // Movimiento
  cayoEnCasilla: (
    nombre: string,
    color: string | undefined,
    casillaEmoji: string,
    casillaNombre: string
  ) =>
    `📍 ${nombre}${
      color ? ` (${color})` : ""
    } cayó en: ${casillaEmoji} ${casillaNombre}`,

  pasoRecarga: (cantidad: number) =>
    `🏦 ¡El cliente pasó por RECARGA! +$${cantidad}`,

  // Negocios
  compraNegocio: (
    nombre: string,
    color: string | undefined,
    negocio: string,
    precio: number
  ) =>
    `✅ ${nombre}${
      color ? ` (${color})` : ""
    } compró ${negocio} por $${precio}`,

  sinDineroNegocio: (nombre: string, color?: string) =>
    `❌ ${nombre}${color ? ` (${color})` : ""} no tiene suficiente dinero`,

  negocioPropietario: (nombre: string, color?: string) =>
    `🏪 Esta tienda pertenece a ${nombre}${color ? ` (${color})` : ""}`,

  subasta: (nombre: string, color: string | undefined, negocio: string) =>
    `🔨 ${nombre}${
      color ? ` (${color})` : ""
    } no compró ${negocio}. ¡Se inicia SUBASTA!`,

  negocioVacio: (nombre: string, color?: string, negocio?: string) =>
    `⚠️ ${
      nombre ? `${nombre}${color ? ` (${color})` : ""}` : "Alguien"
    } abrió ${negocio || "un negocio"} sin productos. ¡No podrá vender!`,

  // Productos
  compraProductos: () => `🛒 Ahora puedes comprar productos para tu negocio`,

  productosComprados: (
    nombre: string,
    color: string | undefined,
    cantidad: number,
    total: number
  ) =>
    `🛍️ ${nombre}${
      color ? ` (${color})` : ""
    } compró ${cantidad} productos por $${total}`,

  sinDineroProductos: () =>
    `❌ No tienes suficiente dinero para comprar estos productos`,

  // Cartas incógnita
  accionSorpresa: (nombre: string, color?: string) =>
    `🐱❓ ¡${nombre}${color ? ` (${color})` : ""} cayó en Acción Sorpresa!`,

  dineroPositivo: (cantidad: number) => `💰 ¡El cliente recibió +$${cantidad}!`,

  dineroNegativo: (cantidad: number) => `💸 El cliente pagó -$${cantidad}`,

  irNegocio: (negocio: string) => `🏪 El cliente va a ${negocio}`,

  retroceder: (casillas: number) =>
    `🔙 El cliente retrocede ${casillas} casilla(s)`,

  cartaEjecutada: (nombre: string, color?: string, titulo?: string) =>
    `✓ ${nombre}${color ? ` (${color})` : ""} ejecutó: ${
      titulo || "una acción"
    }`,

  // Cliente loco
  clienteLocoGanancia: (
    nombre: string,
    color: string | undefined,
    ganancia: number,
    negocios: number
  ) =>
    `💰 ${nombre}${
      color ? ` (${color})` : ""
    } recibió +$${ganancia} (${negocios} negocios)`,

  clienteLocoGasto: (gasto: number) =>
    `🤪 ¡CLIENTE LOCO! Gastó $${gasto} en todos los negocios`,

  clienteLocoSinNegocios: () =>
    `🤪 ¡CLIENTE LOCO! Pero no hay negocios con dueño`,

  cayoEnNegocio: (negocio: string, nombre: string, color?: string) =>
    `🏪 Cayó en ${negocio} de ${nombre}${color ? ` (${color})` : ""}`,
} as const;
