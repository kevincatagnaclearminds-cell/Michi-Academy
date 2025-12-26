// ====== TIPOS DEL JUEGO ======

import { Negocio, CartaIncognita } from "../../types";

// Fases del juego
export type FaseJuego =
  | "inicio"
  | "jugando"
  | "tirando"
  | "moviendo"
  | "comprando"
  | "comprando_productos"
  | "subastando"
  | "carta_incognita"
  | "turno_completado";

// Modos de juego
export type ModoJuego = "solo" | "local" | "online";

// Notificación del sistema
export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: "info" | "exito" | "alerta" | "turno";
  timestamp: number;
}

// Producto comprado por un jugador
export interface ProductoComprado {
  productoId: string;
  negocioId: string;
  cantidad: number;
}

// Jugador
export interface Jugador {
  id: number;
  nombre: string;
  color: string;
  colorFondo: string;
  emoji: string;
  dinero: number;
  posicion: number;
  negociosComprados: string[];
  productosComprados: ProductoComprado[];
}

// Estado completo del juego
export interface EstadoJuego {
  fase: FaseJuego;
  modoJuego: ModoJuego;
  jugadores: Jugador[];
  jugadorActual: number;
  posicionCliente: number;
  dado: number;
  dineroCliente: number;
  turnoNumero: number;
  negocioActual: Negocio | null;
  cartaIncognitaActual: CartaIncognita | null;
  notificaciones: Notificacion[];
  mensajeRecarga: boolean;
  yaTiroDado: boolean;
  productosSeleccionados: string[];
}

// Acciones del juego (para reducers si se necesitan)
export type AccionJuego =
  | { type: "INICIAR_JUEGO"; payload: { modo: ModoJuego; jugadores: Jugador[] } }
  | { type: "TIRAR_DADO"; payload: number }
  | { type: "MOVER_CLIENTE"; payload: number }
  | { type: "COMPRAR_NEGOCIO" }
  | { type: "RECHAZAR_COMPRA" }
  | { type: "TERMINAR_TURNO" }
  | { type: "AGREGAR_NOTIFICACION"; payload: Notificacion }
  | { type: "REMOVER_NOTIFICACION"; payload: number };

