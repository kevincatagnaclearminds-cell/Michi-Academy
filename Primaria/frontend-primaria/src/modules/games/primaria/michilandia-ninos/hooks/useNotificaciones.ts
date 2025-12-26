// ====== HOOK DE NOTIFICACIONES ======

import { useCallback, useRef } from "react";
import { Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO } from "./constants/juego.constants";

interface UseNotificacionesReturn {
  crearNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => Notificacion;
  programarEliminacion: (id: number, callback: () => void) => void;
}

/**
 * Hook para crear y manejar notificaciones del juego
 */
export const useNotificaciones = (): UseNotificacionesReturn => {
  const contadorId = useRef(0);
  const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

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
  inicioJuego: (emoji: string, nombre: string) => 
    `🎮 ¡Comienza el juego! ${emoji} ${nombre} empieza`,
  
  cambioTurno: (emoji: string, nombre: string) => 
    `🔄 Turno de ${emoji} ${nombre}`,
  
  finTurno: (emoji: string, nombre: string) => 
    `⏭️ ${emoji} ${nombre} terminó su turno`,

  // Dado
  tiroDado: (emoji: string, nombre: string, resultado: number) => 
    `🎲 ${emoji} ${nombre} lanzó el dado: ¡${resultado}!`,

  // Movimiento
  cayoEnCasilla: (emoji: string, casillaEmoji: string, casillaNombre: string) => 
    `📍 ${emoji} cayó en: ${casillaEmoji} ${casillaNombre}`,
  
  pasoRecarga: (cantidad: number) => 
    `🏦 ¡El cliente pasó por RECARGA! +$${cantidad}`,

  // Negocios
  compraNegocio: (emoji: string, nombre: string, negocio: string, precio: number) => 
    `✅ ${emoji} ${nombre} compró ${negocio} por $${precio}`,
  
  sinDineroNegocio: (emoji: string) => 
    `❌ ${emoji} no tiene suficiente dinero`,
  
  negocioPropietario: (emoji: string, nombre: string) => 
    `🏪 Esta tienda pertenece a ${emoji} ${nombre}`,
  
  subasta: (emoji: string, nombre: string, negocio: string) => 
    `🔨 ${emoji} ${nombre} no compró ${negocio}. ¡Se inicia SUBASTA!`,
  
  negocioVacio: (emoji: string, negocio: string) => 
    `⚠️ ${emoji} abrió ${negocio} sin productos. ¡No podrá vender!`,

  // Productos
  compraProductos: () => 
    `🛒 Ahora puedes comprar productos para tu negocio`,
  
  productosComprados: (emoji: string, cantidad: number, total: number) => 
    `🛍️ ${emoji} compró ${cantidad} productos por $${total}`,
  
  sinDineroProductos: () => 
    `❌ No tienes suficiente dinero para comprar estos productos`,

  // Cartas incógnita
  accionSorpresa: (emoji: string) => 
    `🐱❓ ¡${emoji} cayó en Acción Sorpresa!`,
  
  dineroPositivo: (cantidad: number) => 
    `💰 ¡El cliente recibió +$${cantidad}!`,
  
  dineroNegativo: (cantidad: number) => 
    `💸 El cliente pagó -$${cantidad}`,
  
  irNegocio: (negocio: string) => 
    `🏪 El cliente va a ${negocio}`,
  
  retroceder: (casillas: number) => 
    `🔙 El cliente retrocede ${casillas} casilla(s)`,
  
  cartaEjecutada: (emoji: string, titulo: string) => 
    `✓ ${emoji} ejecutó: ${titulo}`,

  // Cliente loco
  clienteLocoGanancia: (emoji: string, nombre: string, ganancia: number, negocios: number) => 
    `💰 ${emoji} ${nombre} recibió +$${ganancia} (${negocios} negocios)`,
  
  clienteLocoGasto: (gasto: number) => 
    `🤪 ¡CLIENTE LOCO! Gastó $${gasto} en todos los negocios`,
  
  clienteLocoSinNegocios: () => 
    `🤪 ¡CLIENTE LOCO! Pero no hay negocios con dueño`,

  cayoEnNegocio: (negocio: string, emoji: string, nombre: string) => 
    `🏪 Cayó en ${negocio} de ${emoji} ${nombre}`,
} as const;

