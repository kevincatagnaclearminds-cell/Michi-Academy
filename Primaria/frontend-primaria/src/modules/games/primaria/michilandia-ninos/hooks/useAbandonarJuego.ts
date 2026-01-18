import { useCallback, type Dispatch, type SetStateAction } from "react";
import { ESTADO_INICIAL } from "./constants/juego.constants";
import type { EstadoJuego, Notificacion } from "./types/juego.types";

type SetEstadoFn = Dispatch<SetStateAction<EstadoJuego>>;
type AgregarNotificacionFn = (
  mensaje: string,
  tipo?: Notificacion["tipo"]
) => void;

/**
 * Abandonar partida: libera los negocios y productos del jugador que abandona
 * y avanza el turno al siguiente jugador. La partida CONTINÚA.
 */
export const useAbandonarJuego = (
  setEstado: SetEstadoFn,
  agregarNotificacion: AgregarNotificacionFn
) => {
  return useCallback((): void => {
    setEstado((prev: EstadoJuego) => {
      const abandonarIndex = prev.jugadorActual;
      const jugadorAbandona = prev.jugadores[abandonarIndex];

      const retirado = {
        ...jugadorAbandona,
        dinero: 0,
        negociosComprados: [],
        productosComprados: [],
        retirado: true,
      };

      // If this was the last player, reset to initial state
      if (prev.jugadores.length <= 1) {
        return {
          ...ESTADO_INICIAL,
          modalGanadores: { motivo: "abandono" },
          jugadoresRetirados: [...(prev.jugadoresRetirados || []), retirado],
          notificaciones: [...(prev.notificaciones || [])],
        };
      }

      // Remove the abandoning player from the array
      let jugadores = prev.jugadores.filter(
        (_: any, idx: number) => idx !== abandonarIndex
      );

      // Re-index ids and ensure color/colorFondo exist to avoid undefined styles
      jugadores = jugadores.map((j: any, newIdx: number) => ({
        ...j,
        id: newIdx,
        color: j.color || "#4ECDC4",
        colorFondo:
          j.colorFondo ||
          (j.color
            ? `linear-gradient(135deg, ${j.color} 0%, ${j.color}cc 100%)`
            : "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)"),
      }));

      // Adjust ventaEnCurso: cancel if owner was abandoning, else shift indices > abandonarIndex
      let ventaEnCurso = prev.ventaEnCurso;
      if (ventaEnCurso) {
        if (ventaEnCurso.propietarioIndex === abandonarIndex) {
          ventaEnCurso = null;
        } else if (ventaEnCurso.propietarioIndex > abandonarIndex) {
          ventaEnCurso = {
            ...ventaEnCurso,
            propietarioIndex: ventaEnCurso.propietarioIndex - 1,
          };
        }
      }

      // Adjust inversionEnCurso similarly
      let inversionEnCurso = prev.inversionEnCurso;
      if (inversionEnCurso) {
        if (inversionEnCurso.jugadorInvirtiendoIndex === abandonarIndex) {
          inversionEnCurso = null;
        } else if (inversionEnCurso.jugadorInvirtiendoIndex > abandonarIndex) {
          inversionEnCurso = {
            ...inversionEnCurso,
            jugadorInvirtiendoIndex:
              inversionEnCurso.jugadorInvirtiendoIndex - 1,
          };
        }
        // also adjust negociosRestantes references if present
        if (inversionEnCurso && inversionEnCurso.negociosRestantes) {
          inversionEnCurso = {
            ...inversionEnCurso,
            negociosRestantes: inversionEnCurso.negociosRestantes.map(
              (nr: any) => ({
                jugadorIndex:
                  nr.jugadorIndex > abandonarIndex
                    ? nr.jugadorIndex - 1
                    : nr.jugadorIndex,
                negocioId: nr.negocioId,
              })
            ),
          };
        }
      }

      // Determine the next current player index after removal
      let siguiente = 0;
      if (abandonarIndex < jugadores.length) {
        // Next player will occupy the same index after removal
        siguiente = abandonarIndex;
      } else {
        // If the abandoning player was the last, wrap to 0
        siguiente = 0;
      }

      return {
        ...prev,
        jugadores,
        jugadorActual: siguiente,
        ventaEnCurso,
        inversionEnCurso,
        productosSeleccionados: [],
        jugadoresRetirados: [...prev.jugadoresRetirados, retirado],
      };
    });

    agregarNotificacion(
      "Un jugador ha abandonado. Sus negocios y productos quedaron libres.",
      "info"
    );
  }, [setEstado, agregarNotificacion]);
};
