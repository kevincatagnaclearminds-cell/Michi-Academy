/**
 * Hook para compra de productos
 *
 * Los IDs de cartas ahora tienen formato "productoId_indice" para soportar
 * productos con múltiples cartas (ej: "michi_cono_simple_0", "michi_cono_simple_1")
 */

import { useCallback } from "react";
import {
  EstadoJuego,
  FaseJuego,
  ProductoComprado,
  Notificacion,
} from "./types/juego.types";
import { calcularCostoProductosConIndice } from "./utils/juego.utils";
import { MENSAJES } from "./useNotificaciones";

interface UseProductosParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseProductosReturn {
  toggleProductoSeleccionado: (cartaId: string) => void;
  confirmarCompraProductos: () => void;
  saltarCompraProductos: () => void;
  calcularCosto: (cartasIds: string[]) => number;
}

/**
 * Extrae el productoId real de un cartaId
 * Formato: "productoId_indice" -> "productoId"
 */
const extraerProductoId = (cartaId: string): string => {
  const partes = cartaId.split("_");
  // El último elemento es el índice, lo removemos
  partes.pop();
  return partes.join("_");
};

export const useProductos = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseProductosParams): UseProductosReturn => {
  /**
   * Selecciona o deselecciona una carta de producto
   */
  const toggleProductoSeleccionado = useCallback(
    (cartaId: string) => {
      setEstado((prev) => ({
        ...prev,
        productosSeleccionados: prev.productosSeleccionados.includes(cartaId)
          ? prev.productosSeleccionados.filter((id) => id !== cartaId)
          : [...prev.productosSeleccionados, cartaId],
      }));
    },
    [setEstado]
  );

  /**
   * Calcula el costo total de cartas seleccionadas
   */
  const calcularCosto = useCallback(
    (cartasIds: string[]): number => calcularCostoProductosConIndice(cartasIds),
    []
  );

  /**
   * Confirma la compra de productos seleccionados
   */
  const confirmarCompraProductos = useCallback(() => {
    setEstado((prev) => {
      if (!prev.negocioActual) return prev;

      const jugador = prev.jugadores[prev.jugadorActual];
      const costoTotal = calcularCostoProductosConIndice(
        prev.productosSeleccionados
      );

      // Verificar dinero suficiente
      if (jugador.dinero < costoTotal) {
        agregarNotificacion(MENSAJES.sinDineroProductos(), "alerta");
        return prev;
      }

      // Agrupar cartas por productoId y contar cuántas de cada una
      const productosCantidad: { [productoId: string]: number } = {};
      prev.productosSeleccionados.forEach((cartaId) => {
        const productoId = extraerProductoId(cartaId);
        productosCantidad[productoId] =
          (productosCantidad[productoId] || 0) + 1;
      });

      // Actualizar jugador con productos
      const nuevosJugadores = prev.jugadores.map((j, i) => {
        if (i !== prev.jugadorActual) return j;

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

      // Notificar compra
      if (prev.productosSeleccionados.length > 0) {
        agregarNotificacion(
          MENSAJES.productosComprados(
            jugador.nombre,
            jugador.color,
            prev.productosSeleccionados.length,
            costoTotal
          ),
          "exito"
        );
      }

      return {
        ...prev,
        jugadores: nuevosJugadores,
        fase: "jugando" as FaseJuego,
        negocioActual: null,
        productosSeleccionados: [],
      };
    });
  }, [setEstado, agregarNotificacion]);

  /**
   * Salta la compra de productos (abre negocio vacío)
   */
  const saltarCompraProductos = useCallback(() => {
    const jugador = estado.jugadores[estado.jugadorActual];

    agregarNotificacion(
      MENSAJES.negocioVacio(
        jugador.nombre,
        jugador.color,
        estado.negocioActual?.nombre || ""
      ),
      "alerta"
    );

    setEstado((prev) => ({
      ...prev,
      fase: "jugando" as FaseJuego,
      negocioActual: null,
      productosSeleccionados: [],
    }));
  }, [
    estado.jugadores,
    estado.jugadorActual,
    estado.negocioActual,
    setEstado,
    agregarNotificacion,
  ]);

  return {
    toggleProductoSeleccionado,
    confirmarCompraProductos,
    saltarCompraProductos,
    calcularCosto,
  };
};
