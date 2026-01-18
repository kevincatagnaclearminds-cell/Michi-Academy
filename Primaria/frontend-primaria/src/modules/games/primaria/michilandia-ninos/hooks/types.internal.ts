import type { EstadoJuego, Notificacion } from "./types/juego.types";
export type SetEstadoFn = (
  fn: ((prev: EstadoJuego) => EstadoJuego) | EstadoJuego
) => void;
export type AgregarNotificacionFn = (
  mensaje: string,
  tipo?: Notificacion["tipo"]
) => void;
