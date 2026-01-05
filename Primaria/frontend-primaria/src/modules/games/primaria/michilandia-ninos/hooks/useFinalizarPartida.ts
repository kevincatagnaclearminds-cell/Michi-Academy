import { useCallback } from "react";
import { ESTADO_INICIAL } from "./constants/juego.constants";
import type { SetEstadoFn, AgregarNotificacionFn } from "./types.internal";

export const useFinalizarPartida = (
  setEstado: SetEstadoFn,
  agregarNotificacion: AgregarNotificacionFn
) => {
  return useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      fase: "fin_partida",
      ventaEnCurso: null,
      inversionEnCurso: null,
      clienteLocoEnCurso: null,
      subastaEnCurso: null,
      modalGanadores: { motivo: "abandono" },
    }));
    agregarNotificacion("Partida finalizada.", "turno");
  }, [setEstado, agregarNotificacion]);
};
