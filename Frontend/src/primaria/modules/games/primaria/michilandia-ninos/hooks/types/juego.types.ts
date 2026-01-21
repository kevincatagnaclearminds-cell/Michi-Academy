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
  | "vendiendo_productos" // Cliente compra a negocio con dueño
  | "invirtiendo" // Los jugadores compran productos para sus negocios
  | "cliente_loco_vendiendo" // Cliente compra 1 producto en cada negocio
  | "subastando"
  | "carta_incognita"
  | "turno_completado"
  | "fin_partida";

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
  retirado?: boolean;
}

export interface ModalGanadoresState {
  motivo: "sin_dinero_cliente" | "abandono";
}

export type EstadoSubastaJugador = "activo" | "retirado";

export interface SubastaJugadorInfo {
  jugadorIndex: number;
  monto: number;
  estado: EstadoSubastaJugador;
}

export interface SubastaEnCurso {
  negocio: Negocio;
  turnoIndex: number; // índice del jugador cuyo turno es
  pujaActual: number;
  lider?: { jugadorIndex: number; monto: number };
  jugadores: SubastaJugadorInfo[];
}

// Información de venta cuando cliente cae en negocio con dueño
export interface VentaEnCurso {
  propietarioIndex: number; // Índice del jugador dueño del negocio
  negocioId: string;
  productosAVender: string[]; // IDs de productos seleccionados para vender
  cantidadRequerida: number; // 3 productos obligatorios (1 para cliente loco)
  esClienteLoco?: boolean; // Indica si es una venta a cliente loco
  negociosRestantes?: { propietarioIndex: number; negocioId: string }[]; // Negocios pendientes en cliente loco
}

// Información de inversión cuando el cliente cae en "Invertir"
export interface InversionEnCurso {
  jugadorInvirtiendoIndex: number; // Índice del jugador que está comprando productos
  negocioIndex: number; // Índice del negocio actual dentro de la lista
  negociosRestantes: { jugadorIndex: number; negocioId: string }[]; // Cola de negocios pendientes
}

// Información cuando el cliente se vuelve loco (compra en todos los negocios)
export interface ClienteLocoEnCurso {
  negocioIndex: number; // Índice del negocio actual
  negociosConDueno: { propietarioIndex: number; negocioId: string }[]; // Lista de negocios con dueño
  productosVendidos: string[]; // IDs de productos ya vendidos
}

// Información del modal de productos insuficientes
export interface ModalProductosInsuficientesInfo {
  nombreJugador: string;
  productosActuales: number;
  jugadorColor: string;
  jugadorColorFondo: string;
}

// Información del modal de negocio no comprado
export interface ModalNegocioNoCompradoInfo {
  nombreNegocio: string;
}

// Información del modal de producto no disponible
export interface ModalProductoNoDisponibleInfo {
  nombreProducto: string;
  nombreNegocio: string;
  razon: "sin_stock" | "sin_propietario" | "no_existe";
  nombrePropietario?: string;
}

// Información del modal de compra automática (cartas de retroceso)
export interface ModalCompraAutomaticaInfo {
  nombreProducto: string;
  precioProducto: number;
  nombreNegocio: string;
  nombrePropietario: string;
  tipoProducto: "mas_caro" | "mas_barato";
}

// Información del modal de compra forzada (ir a negocio y comprar producto específico)
export interface ModalCompraForzadaInfo {
  nombreProducto: string;
  precioProducto: number;
  nombreNegocio: string;
  nombrePropietario: string;
  colorPropietario: string;
  colorFondoPropietario: string;
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
  ventaEnCurso: VentaEnCurso | null; // Para ventas
  inversionEnCurso: InversionEnCurso | null; // Para fase de inversión
  clienteLocoEnCurso: ClienteLocoEnCurso | null; // Para fase de cliente loco
  subastaEnCurso: SubastaEnCurso | null;
  modalGanadores: ModalGanadoresState | null;
  jugadoresRetirados: Jugador[];
  modalProductosInsuficientes: ModalProductosInsuficientesInfo | null;
  modalNegocioNoComprado: ModalNegocioNoCompradoInfo | null;
  modalProductoNoDisponible: ModalProductoNoDisponibleInfo | null;
  modalCompraAutomatica: ModalCompraAutomaticaInfo | null;
  modalCompraForzada: ModalCompraForzadaInfo | null;
}

// Acciones del juego (para reducers si se necesitan)
export type AccionJuego =
  | {
      type: "INICIAR_JUEGO";
      payload: { modo: ModoJuego; jugadores: Jugador[] };
    }
  | { type: "TIRAR_DADO"; payload: number }
  | { type: "MOVER_CLIENTE"; payload: number }
  | { type: "COMPRAR_NEGOCIO" }
  | { type: "RECHAZAR_COMPRA" }
  | { type: "TERMINAR_TURNO" }
  | { type: "AGREGAR_NOTIFICACION"; payload: Notificacion }
  | { type: "REMOVER_NOTIFICACION"; payload: number };
