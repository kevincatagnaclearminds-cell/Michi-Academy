// ====== FUNCIONES UTILITARIAS DEL JUEGO ======

import { TABLERO, NEGOCIOS, PRODUCTOS } from "../../types";
import { Jugador, ModoJuego, ProductoComprado } from "../types/juego.types";
import { COLORES_JUGADORES, CONFIG_JUEGO } from "../constants/juego.constants";

// ====== JUGADORES ======

/**
 * Crea los jugadores según el modo de juego
 */
export const crearJugadores = (modo: ModoJuego): Jugador[] => {
  const cantidad = modo === "solo" ? 1 : 5;
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    nombre: modo === "solo" ? "Tú" : `Jugador ${i + 1}`,
    color: COLORES_JUGADORES[i].color,
    colorFondo: COLORES_JUGADORES[i].colorFondo,
    emoji: COLORES_JUGADORES[i].emoji,
    dinero: CONFIG_JUEGO.DINERO_INICIAL_JUGADOR,
    posicion: 0,
    negociosComprados: [],
    productosComprados: [],
  }));
};

/**
 * Obtiene el jugador actual del array de jugadores
 */
export const getJugadorActual = (jugadores: Jugador[], indice: number): Jugador => {
  return jugadores[indice];
};

/**
 * Busca al propietario de un negocio
 */
export const buscarPropietarioNegocio = (jugadores: Jugador[], negocioId: string): Jugador | undefined => {
  return jugadores.find((j) => j.negociosComprados.includes(negocioId));
};

/**
 * Verifica si un negocio ya está comprado por algún jugador
 */
export const esNegocioComprado = (jugadores: Jugador[], negocioId: string): boolean => {
  return jugadores.some((j) => j.negociosComprados.includes(negocioId));
};

/**
 * Obtiene todos los IDs de negocios comprados por todos los jugadores
 */
export const getTodosNegociosComprados = (jugadores: Jugador[]): string[] => {
  return jugadores.flatMap((j) => j.negociosComprados);
};

// ====== TABLERO Y CASILLAS ======

/**
 * Obtiene la casilla en una posición del tablero
 */
export const getCasilla = (posicion: number) => {
  return TABLERO[posicion];
};

/**
 * Calcula la nueva posición después de moverse
 */
export const calcularNuevaPosicion = (
  posicionActual: number, 
  casillas: number
): number => {
  return (posicionActual + casillas) % CONFIG_JUEGO.TOTAL_CASILLAS;
};

/**
 * Calcula la posición al retroceder casillas
 */
export const calcularPosicionRetroceso = (
  posicionActual: number, 
  casillas: number
): number => {
  return (posicionActual - casillas + CONFIG_JUEGO.TOTAL_CASILLAS) % CONFIG_JUEGO.TOTAL_CASILLAS;
};

/**
 * Verifica si una posición es la casilla de recarga (posición 0)
 */
export const esCasillaRecarga = (posicion: number): boolean => {
  return posicion === 0;
};

// ====== NEGOCIOS ======

/**
 * Busca un negocio por su ID de casilla
 */
export const buscarNegocioPorCasilla = (casillaId: number) => {
  return NEGOCIOS.find((n) => n.casillaId === casillaId);
};

/**
 * Busca un negocio por su ID
 */
export const buscarNegocioPorId = (negocioId: string) => {
  return NEGOCIOS.find((n) => n.id === negocioId);
};

/**
 * Obtiene la posición (casilla) de un negocio
 */
export const getPosicionNegocio = (negocioId: string): number => {
  const negocio = buscarNegocioPorId(negocioId);
  return negocio?.casillaId ?? -1;
};

// ====== PRODUCTOS ======

/**
 * Busca un producto por su ID
 */
export const buscarProductoPorId = (productoId: string) => {
  return PRODUCTOS.find((p) => p.id === productoId);
};

/**
 * Extrae el productoId real de un cartaId con índice
 * Formato: "productoId_indice" -> "productoId"
 */
export const extraerProductoIdDeCartaId = (cartaId: string): string => {
  const partes = cartaId.split('_');
  // El último elemento es el índice, lo removemos
  partes.pop();
  return partes.join('_');
};

/**
 * Calcula el costo total de una lista de productos (IDs simples)
 */
export const calcularCostoProductos = (productosIds: string[]): number => {
  return productosIds.reduce((total, id) => {
    const producto = buscarProductoPorId(id);
    return total + (producto?.precio || 0);
  }, 0);
};

/**
 * Calcula el costo total de cartas con índice (formato "productoId_indice")
 */
export const calcularCostoProductosConIndice = (cartasIds: string[]): number => {
  return cartasIds.reduce((total, cartaId) => {
    const productoId = extraerProductoIdDeCartaId(cartaId);
    const producto = buscarProductoPorId(productoId);
    return total + (producto?.precio || 0);
  }, 0);
};

/**
 * Obtiene la cantidad de un producto que tiene un jugador
 */
export const getCantidadProducto = (
  productosComprados: ProductoComprado[], 
  productoId: string
): number => {
  const comprado = productosComprados.find((p) => p.productoId === productoId);
  return comprado?.cantidad || 0;
};

/**
 * Cuenta el total de productos de un negocio específico
 */
export const contarProductosDeNegocio = (
  productosComprados: ProductoComprado[], 
  negocioId: string
): number => {
  return productosComprados
    .filter((p) => p.negocioId === negocioId)
    .reduce((sum, p) => sum + p.cantidad, 0);
};

// ====== DINERO ======

/**
 * Calcula el nuevo dinero después de un gasto (no baja de 0)
 */
export const calcularDineroRestante = (dineroActual: number, gasto: number): number => {
  return Math.max(0, dineroActual - gasto);
};

/**
 * Verifica si hay suficiente dinero para una compra
 */
export const tieneSuficienteDinero = (dinero: number, costo: number): boolean => {
  return dinero >= costo;
};

// ====== TURNOS ======

/**
 * Calcula el índice del siguiente jugador
 */
export const calcularSiguienteJugador = (
  jugadorActual: number, 
  totalJugadores: number
): number => {
  return (jugadorActual + 1) % totalJugadores;
};

/**
 * Verifica si se completó una ronda (volvió al jugador 0)
 */
export const esNuevaRonda = (siguienteJugador: number): boolean => {
  return siguienteJugador === 0;
};

