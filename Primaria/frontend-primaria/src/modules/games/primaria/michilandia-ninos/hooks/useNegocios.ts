/**
 * Hook para compra de negocios
 */

import { useCallback } from "react";
import { EstadoJuego, FaseJuego, Notificacion } from "./types/juego.types";
import {
  buscarNegocioPorCasilla,
  buscarPropietarioNegocio,
} from "./utils/juego.utils";
import { MENSAJES } from "./useNotificaciones";

interface UseNegociosParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseNegociosReturn {
  comprarNegocio: () => void;
  rechazarCompra: () => void;
  esNegocioComprado: (negocioId: string) => boolean;
  getNegocioPorCasilla: (
    casillaId: number
  ) => ReturnType<typeof buscarNegocioPorCasilla>;
  getPropietarioNegocio: (
    negocioId: string
  ) => ReturnType<typeof buscarPropietarioNegocio>;
}

export const useNegocios = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseNegociosParams): UseNegociosReturn => {
  /**
   * Compra el negocio actual y pasa a comprar productos
   */
  const comprarNegocio = useCallback(() => {
    setEstado((prev) => {
      if (!prev.negocioActual) return prev;

      const jugador = prev.jugadores[prev.jugadorActual];
      const precio = prev.negocioActual.precio;

      // Verificar dinero suficiente
      if (jugador.dinero < precio) {
        agregarNotificacion(
          MENSAJES.sinDineroNegocio(jugador.nombre, jugador.color),
          "alerta"
        );
        return prev;
      }

      // Actualizar jugador con nuevo negocio
      const nuevosJugadores = prev.jugadores.map((j, i) =>
        i === prev.jugadorActual
          ? {
              ...j,
              dinero: j.dinero - precio,
              negociosComprados: [
                ...j.negociosComprados,
                prev.negocioActual!.id,
              ],
            }
          : j
      );

      agregarNotificacion(
        MENSAJES.compraNegocio(
          jugador.nombre,
          jugador.color,
          prev.negocioActual.nombre,
          precio
        ),
        "exito"
      );
      agregarNotificacion(MENSAJES.compraProductos(), "info");

      return {
        ...prev,
        jugadores: nuevosJugadores,
        fase: "comprando_productos" as FaseJuego,
        productosSeleccionados: [],
      };
    });
  }, [setEstado, agregarNotificacion]);

  /**
   * Rechaza la compra del negocio (inicia subasta)
   */
  const rechazarCompra = useCallback(() => {
    const jugador = estado.jugadores[estado.jugadorActual];
    const negocio = estado.negocioActual;

    if (negocio) {
      agregarNotificacion(
        MENSAJES.subasta(jugador.nombre, jugador.color, negocio.nombre),
        "alerta"
      );
    }

    setEstado((prev) => ({
      ...prev,
      fase: "jugando" as FaseJuego,
      negocioActual: null,
    }));
  }, [
    estado.jugadores,
    estado.jugadorActual,
    estado.negocioActual,
    setEstado,
    agregarNotificacion,
  ]);

  /**
   * Verifica si un negocio ya está comprado
   */
  const esNegocioComprado = useCallback(
    (negocioId: string) =>
      estado.jugadores.some((j) => j.negociosComprados.includes(negocioId)),
    [estado.jugadores]
  );

  /**
   * Obtiene el negocio en una casilla
   */
  const getNegocioPorCasilla = useCallback(
    (casillaId: number) => buscarNegocioPorCasilla(casillaId),
    []
  );

  /**
   * Obtiene el propietario de un negocio
   */
  const getPropietarioNegocio = useCallback(
    (negocioId: string) =>
      buscarPropietarioNegocio(estado.jugadores, negocioId),
    [estado.jugadores]
  );

  return {
    comprarNegocio,
    rechazarCompra,
    esNegocioComprado,
    getNegocioPorCasilla,
    getPropietarioNegocio,
  };
};
