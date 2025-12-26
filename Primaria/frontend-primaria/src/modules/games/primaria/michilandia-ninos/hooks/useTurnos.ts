/**
 * Hook para gestión de turnos
 */

import { useCallback } from "react";
import { EstadoJuego, FaseJuego, Notificacion } from "./types/juego.types";
import { calcularSiguienteJugador, esNuevaRonda } from "./utils/juego.utils";
import { MENSAJES } from "./useNotificaciones";

interface UseTurnosParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseTurnosReturn {
  terminarTurno: () => void;
  siguienteTurno: () => void;
}

export const useTurnos = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseTurnosParams): UseTurnosReturn => {
  
  /**
   * Cambia al siguiente jugador
   */
  const siguienteTurno = useCallback(() => {
    setEstado((prev) => {
      if (prev.fase !== "turno_completado" && prev.fase !== "jugando") {
        return prev;
      }

      const siguienteJugador = calcularSiguienteJugador(
        prev.jugadorActual,
        prev.jugadores.length
      );
      const nuevoTurno = esNuevaRonda(siguienteJugador)
        ? prev.turnoNumero + 1
        : prev.turnoNumero;
      const jugador = prev.jugadores[siguienteJugador];

      agregarNotificacion(
        MENSAJES.cambioTurno(jugador.emoji, jugador.nombre),
        "turno"
      );

      return {
        ...prev,
        jugadorActual: siguienteJugador,
        turnoNumero: nuevoTurno,
        fase: "jugando" as FaseJuego,
        negocioActual: null,
        yaTiroDado: false,
      };
    });
  }, [setEstado, agregarNotificacion]);

  /**
   * Termina el turno actual manualmente
   */
  const terminarTurno = useCallback(() => {
    if (!estado.yaTiroDado) return;

    const jugador = estado.jugadores[estado.jugadorActual];
    agregarNotificacion(
      MENSAJES.finTurno(jugador.emoji, jugador.nombre),
      "info"
    );
    siguienteTurno();
  }, [
    estado.jugadores,
    estado.jugadorActual,
    estado.yaTiroDado,
    agregarNotificacion,
    siguienteTurno,
  ]);

  return {
    terminarTurno,
    siguienteTurno,
  };
};

