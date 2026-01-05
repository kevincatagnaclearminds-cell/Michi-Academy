import { useCallback } from "react";
import { NEGOCIOS } from "../types";
import {
  EstadoJuego,
  FaseJuego,
  SubastaEnCurso,
  SubastaJugadorInfo,
  Notificacion,
} from "./types/juego.types";

interface UseSubastaParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseSubastaReturn {
  iniciarSubasta: (negocioId: string, turnoInicio?: number) => void;
  pujar: (incremento: number) => void;
  retirarse: () => void;
  cerrarSubasta: () => void;
}

const crearSubasta = (
  estado: EstadoJuego,
  negocioId: string,
  turnoInicio?: number
): SubastaEnCurso | null => {
  const negocio = NEGOCIOS.find((n) => n.id === negocioId);
  if (!negocio) return null;

  const precioBase = Math.floor(negocio.precio * 0.5);

  const jugadores: SubastaJugadorInfo[] = estado.jugadores.map((_, idx) => ({
    jugadorIndex: idx,
    monto: 0,
    estado: "activo",
  }));

  return {
    negocio,
    turnoIndex: turnoInicio ?? estado.jugadorActual,
    pujaActual: precioBase,
    lider: undefined,
    jugadores,
  };
};

const siguienteActivo = (subasta: SubastaEnCurso, desde: number): number => {
  const total = subasta.jugadores.length;
  for (let i = 1; i <= total; i++) {
    const idx = (desde + i) % total;
    if (subasta.jugadores[idx].estado === "activo") return idx;
  }
  return desde;
};

const contarActivos = (subasta: SubastaEnCurso): number =>
  subasta.jugadores.filter((j) => j.estado === "activo").length;

export const useSubasta = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseSubastaParams): UseSubastaReturn => {
  const iniciarSubasta = useCallback(
    (negocioId: string, turnoInicio?: number) => {
      setEstado((prev) => {
        const nueva = crearSubasta(prev, negocioId, turnoInicio);
        if (!nueva) return prev;
        return {
          ...prev,
          fase: "subastando" as FaseJuego,
          negocioActual: nueva.negocio,
          subastaEnCurso: nueva,
        };
      });
    },
    [setEstado]
  );

  const resolverEstadoSubasta = (
    prev: EstadoJuego,
    subasta: SubastaEnCurso
  ): EstadoJuego => {
    const activos = contarActivos(subasta);

    if (activos === 0) {
      return {
        ...prev,
        subastaEnCurso: null,
        negocioActual: null,
        fase: "jugando" as FaseJuego,
      };
    }

    if (activos === 1) {
      const ganador = subasta.jugadores.find((j) => j.estado === "activo");
      const ganadorIndex = ganador?.jugadorIndex ?? null;
      const monto = subasta.lider?.monto ?? subasta.pujaActual;

      if (ganadorIndex === null) {
        return {
          ...prev,
          subastaEnCurso: null,
          negocioActual: null,
          fase: "jugando" as FaseJuego,
        };
      }

      const nuevosJugadores = prev.jugadores.map((j, idx) => {
        if (idx !== ganadorIndex) return j;
        return {
          ...j,
          dinero: Math.max(0, j.dinero - monto),
          negociosComprados: [...j.negociosComprados, subasta.negocio.id],
        };
      });

      agregarNotificacion(
        `${prev.jugadores[ganadorIndex].nombre} ganó la subasta de ${subasta.negocio.nombre} por $${monto}`,
        "exito"
      );

      return {
        ...prev,
        jugadores: nuevosJugadores,
        subastaEnCurso: null,
        negocioActual: null,
        fase: "jugando" as FaseJuego,
      };
    }

    const siguiente = siguienteActivo(subasta, subasta.turnoIndex);
    return {
      ...prev,
      subastaEnCurso: { ...subasta, turnoIndex: siguiente },
    };
  };

  const pujar = useCallback(
    (incremento: number) => {
      setEstado((prev) => {
        const subasta = prev.subastaEnCurso;
        if (!subasta) return prev;
        const turno = subasta.turnoIndex;
        const jugador = prev.jugadores[turno];
        if (!jugador || subasta.jugadores[turno].estado === "retirado")
          return prev;

        const nuevaPuja = subasta.pujaActual + incremento;
        if (jugador.dinero < nuevaPuja) return prev;

        const nuevosJugadores = subasta.jugadores.map((p) =>
          p.jugadorIndex === turno
            ? { ...p, monto: nuevaPuja, estado: "activo" as const }
            : p
        );

        const actualizado: SubastaEnCurso = {
          ...subasta,
          pujaActual: nuevaPuja,
          lider: { jugadorIndex: turno, monto: nuevaPuja },
          jugadores: nuevosJugadores,
        };

        return resolverEstadoSubasta(prev, actualizado);
      });
    },
    [setEstado]
  );

  const retirarse = useCallback(() => {
    setEstado((prev) => {
      const subasta = prev.subastaEnCurso;
      if (!subasta) return prev;
      const turno = subasta.turnoIndex;

      const nuevosJugadores = subasta.jugadores.map((p) =>
        p.jugadorIndex === turno ? { ...p, estado: "retirado" } : p
      );

      const actualizado: SubastaEnCurso = {
        ...subasta,
        jugadores: nuevosJugadores,
      };

      return resolverEstadoSubasta(prev, actualizado);
    });
  }, [setEstado]);

  const cerrarSubasta = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      subastaEnCurso: null,
      negocioActual: null,
      fase: "jugando" as FaseJuego,
    }));
  }, [setEstado]);

  return { iniciarSubasta, pujar, retirarse, cerrarSubasta };
};
