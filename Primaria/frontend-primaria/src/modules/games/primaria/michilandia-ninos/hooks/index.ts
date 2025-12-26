/**
 * Exportaciones del módulo de hooks del juego MichiLandia
 *
 * Estructura modular:
 * - useJuego: Hook principal orquestador (~150 líneas)
 * - useTurnos: Gestión de turnos (~80 líneas)
 * - useMovimiento: Dado y movimiento (~170 líneas)
 * - useNegocios: Compra de negocios (~120 líneas)
 * - useProductos: Compra de productos (~140 líneas)
 * - useCartasIncognita: Cartas sorpresa (~230 líneas)
 * - useNotificaciones: Sistema de notificaciones (~145 líneas)
 * 
 * Archivos de soporte:
 * - types/juego.types.ts: Tipos e interfaces
 * - constants/juego.constants.ts: Constantes y configuración
 * - utils/juego.utils.ts: Funciones utilitarias reutilizables
 */

// Hook principal
export { useJuego } from "./useJuego";

// Hooks especializados (para uso avanzado si se necesitan por separado)
export { useTurnos } from "./useTurnos";
export { useMovimiento } from "./useMovimiento";
export { useNegocios } from "./useNegocios";
export { useProductos } from "./useProductos";
export { useCartasIncognita } from "./useCartasIncognita";
export { useNotificaciones, MENSAJES } from "./useNotificaciones";

// Tipos
export type {
  FaseJuego,
  ModoJuego,
  EstadoJuego,
  Jugador,
  Notificacion,
  ProductoComprado,
  AccionJuego,
} from "./types/juego.types";

// Constantes
export {
  CONFIG_JUEGO,
  COLORES_JUGADORES,
  ESTADO_INICIAL,
} from "./constants/juego.constants";

// Funciones utilitarias
export {
  // Jugadores
  crearJugadores,
  getJugadorActual,
  buscarPropietarioNegocio,
  esNegocioComprado,
  getTodosNegociosComprados,
  // Tablero
  getCasilla,
  calcularNuevaPosicion,
  calcularPosicionRetroceso,
  esCasillaRecarga,
  // Negocios
  buscarNegocioPorCasilla,
  buscarNegocioPorId,
  getPosicionNegocio,
  // Productos
  buscarProductoPorId,
  extraerProductoIdDeCartaId,
  calcularCostoProductos,
  calcularCostoProductosConIndice,
  getCantidadProducto,
  contarProductosDeNegocio,
  // Dinero
  calcularDineroRestante,
  tieneSuficienteDinero,
  // Turnos
  calcularSiguienteJugador,
  esNuevaRonda,
} from "./utils/juego.utils";
