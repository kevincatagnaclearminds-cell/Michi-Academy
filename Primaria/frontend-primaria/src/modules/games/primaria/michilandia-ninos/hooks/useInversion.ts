/**
 * Hook para gestión de la fase de inversión
 *
 * Cuando el cliente cae en "Invertir", todos los jugadores pueden
 * comprar productos para sus negocios.
 * Se procesan todos los negocios de un jugador antes de pasar al siguiente.
 */

import { useCallback } from "react";
import { NEGOCIOS } from "../types";
import {
  EstadoJuego,
  FaseJuego,
  Notificacion,
  InversionEnCurso,
} from "./types/juego.types";
import {
  calcularCostoProductosConIndice,
  extraerProductoIdDeCartaId,
} from "./utils/juego.utils";

interface UseInversionParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseInversionReturn {
  iniciarFaseInversion: () => void;
  confirmarCompraInversion: () => void;
  saltarCompraInversion: () => void;
  toggleProductoInversion: (productoId: string) => void;
}

export const useInversion = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseInversionParams): UseInversionReturn => {
  /**
   * Genera la lista ordenada de negocios por jugador
   * Agrupa todos los negocios de cada jugador juntos
   */
  const generarColaNegocios = useCallback(
    (jugadores: typeof estado.jugadores) => {
      const cola: { jugadorIndex: number; negocioId: string }[] = [];

      // Recorrer cada jugador y agregar sus negocios
      jugadores.forEach((jugador, jugadorIndex) => {
        jugador.negociosComprados.forEach((negocioId) => {
          cola.push({ jugadorIndex, negocioId });
        });
      });

      return cola;
    },
    []
  );

  /**
   * Inicia la fase de inversión cuando el cliente cae en "Invertir"
   */
  const iniciarFaseInversion = useCallback(() => {
    setEstado((prev) => {
      const colaNegocios = generarColaNegocios(prev.jugadores);

      // Si no hay negocios comprados, saltar la fase
      if (colaNegocios.length === 0) {
        agregarNotificacion(
          "💰 ¡Casilla de Inversión! Pero no hay negocios comprados para invertir.",
          "info"
        );
        return {
          ...prev,
          fase: "jugando" as FaseJuego,
        };
      }

      const primerNegocio = colaNegocios[0];
      const negocio = NEGOCIOS.find((n) => n.id === primerNegocio.negocioId);
      const jugador = prev.jugadores[primerNegocio.jugadorIndex];

      agregarNotificacion(
        `💰 ¡Fase de Inversión! ${jugador.nombre}${
          jugador.color ? ` (${jugador.color})` : ""
        } puede comprar productos para ${negocio?.nombre}`,
        "turno"
      );

      return {
        ...prev,
        fase: "invirtiendo" as FaseJuego,
        negocioActual: negocio || null,
        productosSeleccionados: [],
        inversionEnCurso: {
          jugadorInvirtiendoIndex: primerNegocio.jugadorIndex,
          negocioIndex: 0,
          negociosRestantes: colaNegocios,
        },
      };
    });
  }, [setEstado, agregarNotificacion, generarColaNegocios]);

  /**
   * Pasa al siguiente negocio en la cola de inversión
   */
  const pasarSiguienteNegocio = useCallback(() => {
    setEstado((prev) => {
      if (!prev.inversionEnCurso) return prev;

      const { negocioIndex, negociosRestantes } = prev.inversionEnCurso;
      const siguienteIndex = negocioIndex + 1;

      // Si no hay más negocios, terminar fase de inversión
      if (siguienteIndex >= negociosRestantes.length) {
        agregarNotificacion(
          "✅ ¡Fase de inversión completada! Todos los jugadores tuvieron su oportunidad.",
          "exito"
        );
        return {
          ...prev,
          fase: "jugando" as FaseJuego,
          negocioActual: null,
          productosSeleccionados: [],
          inversionEnCurso: null,
        };
      }

      // Pasar al siguiente negocio
      const siguienteNegocio = negociosRestantes[siguienteIndex];
      const negocio = NEGOCIOS.find((n) => n.id === siguienteNegocio.negocioId);
      const jugador = prev.jugadores[siguienteNegocio.jugadorIndex];

      agregarNotificacion(
        `💰 Turno de inversión: ${jugador.nombre}${
          jugador.color ? ` (${jugador.color})` : ""
        } - ${negocio?.nombre}`,
        "turno"
      );

      return {
        ...prev,
        negocioActual: negocio || null,
        productosSeleccionados: [],
        inversionEnCurso: {
          ...prev.inversionEnCurso,
          jugadorInvirtiendoIndex: siguienteNegocio.jugadorIndex,
          negocioIndex: siguienteIndex,
        },
      };
    });
  }, [setEstado, agregarNotificacion]);

  /**
   * Alternar selección de producto para compra en inversión
   */
  const toggleProductoInversion = useCallback(
    (productoId: string) => {
      setEstado((prev) => ({
        ...prev,
        productosSeleccionados: prev.productosSeleccionados.includes(productoId)
          ? prev.productosSeleccionados.filter((id) => id !== productoId)
          : [...prev.productosSeleccionados, productoId],
      }));
    },
    [setEstado]
  );

  /**
   * Confirmar la compra de productos en la fase de inversión
   */
  const confirmarCompraInversion = useCallback(() => {
    setEstado((prev) => {
      if (!prev.inversionEnCurso || !prev.negocioActual) return prev;

      const { jugadorInvirtiendoIndex } = prev.inversionEnCurso;
      const jugador = prev.jugadores[jugadorInvirtiendoIndex];
      const costoTotal = calcularCostoProductosConIndice(
        prev.productosSeleccionados
      );

      // Verificar dinero suficiente
      if (jugador.dinero < costoTotal) {
        agregarNotificacion(
          `❌ ${jugador.nombre}${
            jugador.color ? ` (${jugador.color})` : ""
          } No tienes suficiente dinero para esta compra ($${
            jugador.dinero
          } < $${costoTotal})`,
          "alerta"
        );
        return prev;
      }

      // Agrupar productos seleccionados por ID base
      const productosCantidad: { [productoId: string]: number } = {};
      prev.productosSeleccionados.forEach((cartaId) => {
        const productoId = extraerProductoIdDeCartaId(cartaId);
        productosCantidad[productoId] =
          (productosCantidad[productoId] || 0) + 1;
      });

      // Actualizar jugador con los productos comprados
      const nuevosJugadores = prev.jugadores.map((j, i) => {
        if (i !== jugadorInvirtiendoIndex) return j;

        const productosActualizados = [...j.productosComprados];

        Object.entries(productosCantidad).forEach(([productoId, cantidad]) => {
          const existente = productosActualizados.find(
            (p) => p.productoId === productoId
          );
          if (existente) {
            existente.cantidad += cantidad;
          } else {
            productosActualizados.push({
              productoId,
              negocioId: prev.negocioActual!.id,
              cantidad,
            });
          }
        });

        return {
          ...j,
          dinero: j.dinero - costoTotal,
          productosComprados: productosActualizados,
        };
      });

      // Notificar compra exitosa
      if (prev.productosSeleccionados.length > 0) {
        agregarNotificacion(
          `🛒 ${jugador.nombre}${
            jugador.color ? ` (${jugador.color})` : ""
          } compró ${
            prev.productosSeleccionados.length
          } productos por $${costoTotal}`,
          "exito"
        );
      }

      return {
        ...prev,
        jugadores: nuevosJugadores,
      };
    });

    // Pasar al siguiente negocio después de un pequeño delay
    setTimeout(() => {
      pasarSiguienteNegocio();
    }, 500);
  }, [setEstado, agregarNotificacion, pasarSiguienteNegocio]);

  /**
   * Saltar compra de productos en inversión (no comprar nada)
   */
  const saltarCompraInversion = useCallback(() => {
    if (!estado.inversionEnCurso) return;

    const jugador =
      estado.jugadores[estado.inversionEnCurso.jugadorInvirtiendoIndex];

    agregarNotificacion(
      `⏭️ ${jugador.nombre}${
        jugador.color ? ` (${jugador.color})` : ""
      } decidió no invertir en ${estado.negocioActual?.nombre}`,
      "info"
    );

    pasarSiguienteNegocio();
  }, [estado, agregarNotificacion, pasarSiguienteNegocio]);

  return {
    iniciarFaseInversion,
    confirmarCompraInversion,
    saltarCompraInversion,
    toggleProductoInversion,
  };
};
