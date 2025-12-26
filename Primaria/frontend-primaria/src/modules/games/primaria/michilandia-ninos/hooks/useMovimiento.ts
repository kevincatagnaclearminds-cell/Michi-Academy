/**
 * Hook para movimiento del cliente (dado y posición)
 */

import { useCallback } from "react";
import { CARTAS_INCOGNITA } from "../types";
import { EstadoJuego, FaseJuego, Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO } from "./constants/juego.constants";
import {
  getCasilla,
  buscarNegocioPorCasilla,
  getTodosNegociosComprados,
  buscarPropietarioNegocio,
} from "./utils/juego.utils";
import { MENSAJES } from "./useNotificaciones";

interface UseMovimientoParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseMovimientoReturn {
  tirarDado: (resultado: number) => void;
}

export const useMovimiento = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseMovimientoParams): UseMovimientoReturn => {

  /**
   * Procesa la llegada a una casilla después del movimiento
   */
  const procesarLlegada = useCallback(
    (pasoRecarga: boolean) => {
      setEstado((prev) => {
        const casillaActual = getCasilla(prev.posicionCliente);
        const jugadorActivo = prev.jugadores[prev.jugadorActual];

        let nuevoDineroCliente = prev.dineroCliente;
        
        // Bonus por pasar por recarga
        if (pasoRecarga) {
          nuevoDineroCliente += CONFIG_JUEGO.RECARGA_BANCO;
          agregarNotificacion(
            MENSAJES.pasoRecarga(CONFIG_JUEGO.RECARGA_BANCO),
            "exito"
          );
        }

        // Notificar casilla actual
        agregarNotificacion(
          MENSAJES.cayoEnCasilla(
            jugadorActivo.emoji,
            casillaActual.emoji,
            casillaActual.nombre
          ),
          "info"
        );

        // Casilla de evento -> Carta incógnita
        if (casillaActual.tipo === "evento") {
          const cartaAleatoria =
            CARTAS_INCOGNITA[
              Math.floor(Math.random() * CARTAS_INCOGNITA.length)
            ];
          agregarNotificacion(
            MENSAJES.accionSorpresa(jugadorActivo.emoji),
            "alerta"
          );

          return {
            ...prev,
            fase: "carta_incognita" as FaseJuego,
            cartaIncognitaActual: cartaAleatoria,
            dineroCliente: nuevoDineroCliente,
            mensajeRecarga: pasoRecarga,
          };
        }

        // Casilla de tienda
        const negocio = buscarNegocioPorCasilla(casillaActual.id);
        const negociosComprados = getTodosNegociosComprados(prev.jugadores);

        // Tienda disponible para comprar
        if (
          negocio &&
          casillaActual.tipo === "tienda" &&
          !negociosComprados.includes(negocio.id)
        ) {
          return {
            ...prev,
            fase: "comprando" as FaseJuego,
            negocioActual: negocio,
            dineroCliente: nuevoDineroCliente,
            mensajeRecarga: pasoRecarga,
          };
        }

        // Tienda ya comprada por alguien
        if (negocio && negociosComprados.includes(negocio.id)) {
          const propietario = buscarPropietarioNegocio(
            prev.jugadores,
            negocio.id
          );
          if (propietario) {
            agregarNotificacion(
              MENSAJES.negocioPropietario(
                propietario.emoji,
                propietario.nombre
              ),
              "info"
            );
          }
        }

        // Casilla normal o especial sin acción
        return {
          ...prev,
          fase: "jugando" as FaseJuego,
          negocioActual: null,
          dineroCliente: nuevoDineroCliente,
          mensajeRecarga: pasoRecarga,
        };
      });
    },
    [setEstado, agregarNotificacion]
  );

  /**
   * Tira el dado y mueve al cliente paso a paso
   */
  const tirarDado = useCallback(
    (resultado: number) => {
      const jugador = estado.jugadores[estado.jugadorActual];

      agregarNotificacion(
        MENSAJES.tiroDado(jugador.emoji, jugador.nombre, resultado),
        "info"
      );

      // Actualizar estado del dado
      setEstado((prev) => ({
        ...prev,
        dado: resultado,
        fase: "moviendo" as FaseJuego,
        mensajeRecarga: false,
        yaTiroDado: true,
      }));

      // Animación de movimiento paso a paso
      let pasoActual = 0;
      let pasoRecarga = false;

      const moverPaso = () => {
        if (pasoActual < resultado) {
          pasoActual++;
          setEstado((prev) => {
            const nuevaPosicion =
              (prev.posicionCliente + 1) % CONFIG_JUEGO.TOTAL_CASILLAS;
            if (nuevaPosicion === 0) pasoRecarga = true;
            return { ...prev, posicionCliente: nuevaPosicion };
          });
          setTimeout(moverPaso, CONFIG_JUEGO.TIEMPO_MOVIMIENTO);
        } else {
          // Terminó de moverse, procesar llegada
          procesarLlegada(pasoRecarga);
        }
      };

      setTimeout(moverPaso, CONFIG_JUEGO.TIEMPO_INICIO_MOVIMIENTO);
    },
    [estado.jugadores, estado.jugadorActual, setEstado, agregarNotificacion, procesarLlegada]
  );

  return {
    tirarDado,
  };
};

