// ====== CONSTANTES DEL JUEGO ======

import { TABLERO } from "../../types";

// Configuración del juego
export const CONFIG_JUEGO = {
  TOTAL_CASILLAS: TABLERO.length,
  DINERO_INICIAL_CLIENTE: 1500,
  DINERO_INICIAL_JUGADOR: 1000,
  RECARGA_BANCO: 100,
  MAX_NOTIFICACIONES: 8,
  DURACION_NOTIFICACION: 5000, // 5 segundos
  TIEMPO_MOVIMIENTO: 300, // ms entre cada paso
  TIEMPO_INICIO_MOVIMIENTO: 500, // ms antes de empezar a mover
  GASTO_CLIENTE_LOCO: 20, // $ por negocio en cliente loco
  PRODUCTOS_VENTA_OBLIGATORIA: 3, // Cliente compra 3 productos obligatoriamente
} as const;

// Colores para cada jugador (fondos más oscuros para mejor visibilidad)
export const COLORES_JUGADORES = [
  {
    color: "#FF6B6B",
    colorFondo:
      "linear-gradient(135deg, #8B0000 0%, #B22222 50%, #CD5C5C 100%)",
    emoji: "🔴",
    nombre: "Rojo",
  },
  {
    color: "#4ECDC4",
    colorFondo:
      "linear-gradient(135deg, #004D40 0%, #00695C 50%, #00897B 100%)",
    emoji: "🟢",
    nombre: "Verde",
  },
  {
    color: "#45B7D1",
    colorFondo:
      "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)",
    emoji: "🔵",
    nombre: "Azul",
  },
  {
    color: "#F7DC6F",
    colorFondo:
      "linear-gradient(135deg, #E65100 0%, #F57C00 50%, #FF9800 100%)",
    emoji: "🟡",
    nombre: "Amarillo",
  },
  {
    color: "#BB8FCE",
    colorFondo:
      "linear-gradient(135deg, #4A148C 0%, #6A1B9A 50%, #8E24AA 100%)",
    emoji: "🟣",
    nombre: "Morado",
  },
] as const;

// Estado inicial del juego
export const ESTADO_INICIAL = {
  fase: "inicio" as const,
  modoJuego: "solo" as const,
  jugadores: [],
  jugadorActual: 0,
  posicionCliente: 0,
  dado: 1,
  dineroCliente: CONFIG_JUEGO.DINERO_INICIAL_CLIENTE,
  turnoNumero: 1,
  negocioActual: null,
  cartaIncognitaActual: null,
  notificaciones: [],
  mensajeRecarga: false,
  yaTiroDado: false,
  productosSeleccionados: [],
  ventaEnCurso: null,
  inversionEnCurso: null,
  clienteLocoEnCurso: null,
  subastaEnCurso: null,
  modalGanadores: null,
  jugadoresRetirados: [],
  modalProductosInsuficientes: null,
  modalNegocioNoComprado: null,
  modalProductoNoDisponible: null,
  modalCompraAutomatica: null,
  modalCompraForzada: null,
};
