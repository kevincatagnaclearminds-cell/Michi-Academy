/**
 * Hook para gestión de ventas cuando el cliente cae en negocio con dueño
 *
 * Reglas:
 * - El Cliente compra obligatoriamente 3 productos de ese negocio
 * - El dueño del negocio elige qué productos vender y recibe el dinero
 * - Si no tiene 3 productos, pierde la venta
 */

import { useCallback } from "react";
import { PRODUCTOS, NEGOCIOS } from "../types";
import { EstadoJuego, FaseJuego, Notificacion } from "./types/juego.types";

interface UseVentasParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseVentasReturn {
  toggleProductoParaVender: (productoId: string) => void;
  confirmarVenta: () => void;
  cancelarVenta: () => void;
  calcularGananciaVenta: () => number;
}

export const useVentas = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseVentasParams): UseVentasReturn => {
  /**
   * Alternar selección de un producto para vender
   */
  const toggleProductoParaVender = useCallback(
    (productoId: string) => {
      setEstado((prev) => {
        if (!prev.ventaEnCurso) return prev;

        const yaSeleccionado =
          prev.ventaEnCurso.productosAVender.includes(productoId);
        let nuevosProductos: string[];

        if (yaSeleccionado) {
          // Quitar de la selección
          nuevosProductos = prev.ventaEnCurso.productosAVender.filter(
            (id) => id !== productoId
          );
        } else {
          // Verificar que no exceda la cantidad requerida
          if (
            prev.ventaEnCurso.productosAVender.length >=
            prev.ventaEnCurso.cantidadRequerida
          ) {
            agregarNotificacion(
              `⚠️ Solo puedes seleccionar ${prev.ventaEnCurso.cantidadRequerida} productos para vender`,
              "alerta"
            );
            return prev;
          }
          // Agregar a la selección
          nuevosProductos = [...prev.ventaEnCurso.productosAVender, productoId];
        }

        return {
          ...prev,
          ventaEnCurso: {
            ...prev.ventaEnCurso,
            productosAVender: nuevosProductos,
          },
        };
      });
    },
    [setEstado, agregarNotificacion]
  );

  /**
   * Calcular la ganancia total de los productos seleccionados para vender
   */
  const calcularGananciaVenta = useCallback((): number => {
    if (!estado.ventaEnCurso) return 0;

    return estado.ventaEnCurso.productosAVender.reduce((total, productoId) => {
      // El productoId puede tener índice (ej: "marisqueria_pescado_1_0")
      const partes = productoId.split("_");
      const ultimaParte = partes[partes.length - 1];
      const tieneIndice = !isNaN(parseInt(ultimaParte)) && partes.length > 2;

      const productoIdBase = tieneIndice
        ? partes.slice(0, -1).join("_")
        : productoId;

      const producto = PRODUCTOS.find((p) => p.id === productoIdBase);
      return total + (producto?.precio || 0);
    }, 0);
  }, [estado.ventaEnCurso]);

  /**
   * Confirmar la venta - el cliente compra los productos seleccionados
   */
  const confirmarVenta = useCallback(() => {
    setEstado((prev) => {
      if (!prev.ventaEnCurso) return prev;

      const {
        propietarioIndex,
        productosAVender,
        cantidadRequerida,
        negocioId,
      } = prev.ventaEnCurso;

      const tipoCompraRetroceder =
        (prev.ventaEnCurso as any).tipoCompraRetroceder || null;

      // Si es retroceso con tipo de compra específico, validar que haya productos disponibles
      if (tipoCompraRetroceder) {
        const propietario = prev.jugadores[propietarioIndex];
        const productosDelNegocio = propietario.productosComprados.filter(
          (p) => p.negocioId === negocioId && p.cantidad > 0
        );

        if (productosDelNegocio.length === 0) {
          // No hay productos en este negocio
          return {
            ...prev,
            modalProductoNoDisponible: {
              nombreProducto:
                tipoCompraRetroceder === "producto_mas_caro"
                  ? "producto más costoso"
                  : "producto más barato",
              nombreNegocio:
                NEGOCIOS.find((n) => n.id === negocioId)?.nombre ||
                "Negocio desconocido",
              razon: "sin_stock" as const,
            },
          };
        }
      }

      // Verificar que se seleccionaron suficientes productos
      if (productosAVender.length < cantidadRequerida) {
        agregarNotificacion(
          `⚠️ Debes seleccionar exactamente ${cantidadRequerida} productos para vender`,
          "alerta"
        );
        return prev;
      }

      // Calcular ganancia total
      const gananciaTotal = productosAVender.reduce((total, productoId) => {
        const partes = productoId.split("_");
        const ultimaParte = partes[partes.length - 1];
        const tieneIndice = !isNaN(parseInt(ultimaParte)) && partes.length > 2;
        const productoIdBase = tieneIndice
          ? partes.slice(0, -1).join("_")
          : productoId;
        const producto = PRODUCTOS.find((p) => p.id === productoIdBase);
        return total + (producto?.precio || 0);
      }, 0);

      // Verificar que el cliente tiene suficiente dinero
      if (prev.dineroCliente < gananciaTotal) {
        agregarNotificacion(
          `❌ El cliente no tiene suficiente dinero ($${prev.dineroCliente} < $${gananciaTotal})`,
          "alerta"
        );
        return prev;
      }

      const propietario = prev.jugadores[propietarioIndex];
      const negocio = prev.negocioActual;
      const esClienteLocoVenta = prev.ventaEnCurso.esClienteLoco || false;
      const negociosRestantesVenta = prev.ventaEnCurso.negociosRestantes || [];

      // Actualizar jugadores
      const nuevosJugadores = prev.jugadores.map((jugador, idx) => {
        if (idx === propietarioIndex) {
          // El propietario recibe el dinero y reduce sus productos
          const nuevosProductos = [...jugador.productosComprados];

          // Reducir cantidad de cada producto vendido
          productosAVender.forEach((productoId) => {
            const partes = productoId.split("_");
            const ultimaParte = partes[partes.length - 1];
            const tieneIndice =
              !isNaN(parseInt(ultimaParte)) && partes.length > 2;
            const productoIdBase = tieneIndice
              ? partes.slice(0, -1).join("_")
              : productoId;

            const productoIdx = nuevosProductos.findIndex(
              (p) =>
                p.productoId === productoIdBase &&
                p.negocioId === negocioId &&
                p.cantidad > 0
            );
            if (productoIdx !== -1) {
              nuevosProductos[productoIdx] = {
                ...nuevosProductos[productoIdx],
                cantidad: nuevosProductos[productoIdx].cantidad - 1,
              };
            }
          });

          return {
            ...jugador,
            dinero: jugador.dinero + gananciaTotal,
            productosComprados: nuevosProductos.filter((p) => p.cantidad > 0),
          };
        }
        return jugador;
      });

      agregarNotificacion(
        `💰 ${esClienteLocoVenta ? "🤪 " : ""}¡Venta exitosa! ${
          propietario.nombre
        }${
          propietario.color ? ` (${propietario.color})` : ""
        } vendió ${cantidadRequerida} ${
          cantidadRequerida === 1 ? "producto" : "productos"
        } por $${gananciaTotal}${negocio ? ` en ${negocio.nombre}` : ""}${
          tipoCompraRetroceder
            ? ` (${
                tipoCompraRetroceder === "producto_mas_caro"
                  ? "producto más costoso"
                  : "producto más barato"
              })`
            : ""
        }`,
        "exito"
      );

      // Si es cliente loco o retroceder, avanzar o terminar
      if (esClienteLocoVenta && negociosRestantesVenta.length > 0) {
        const siguienteNegocio = negociosRestantesVenta[0];
        return {
          ...prev,
          fase: "vendiendo_productos" as FaseJuego,
          jugadores: nuevosJugadores,
          dineroCliente: prev.dineroCliente - gananciaTotal,
          negocioActual: null,
          ventaEnCurso: {
            propietarioIndex: siguienteNegocio.propietarioIndex,
            negocioId: siguienteNegocio.negocioId,
            productosAVender: [],
            cantidadRequerida: 1,
            esClienteLoco: true,
            negociosRestantes: negociosRestantesVenta.slice(1),
          },
        };
      }

      // Si es retroceder con tipoCompra, volver a jugando
      if (tipoCompraRetroceder) {
        return {
          ...prev,
          fase: "jugando" as FaseJuego,
          jugadores: nuevosJugadores,
          dineroCliente: prev.dineroCliente - gananciaTotal,
          negocioActual: null,
          ventaEnCurso: null,
        };
      }

      return {
        ...prev,
        fase: "jugando" as FaseJuego,
        jugadores: nuevosJugadores,
        dineroCliente: prev.dineroCliente - gananciaTotal,
        negocioActual: null,
        ventaEnCurso: null,
      };
    });
  }, [setEstado, agregarNotificacion]);

  /**
   * Cancelar la venta (pierde la oportunidad)
   */
  const cancelarVenta = useCallback(() => {
    setEstado((prev) => {
      if (!prev.ventaEnCurso) return prev;

      const propietario = prev.jugadores[prev.ventaEnCurso.propietarioIndex];
      const esClienteLoco = prev.ventaEnCurso.esClienteLoco || false;
      const tipoCompraRetroceder =
        (prev.ventaEnCurso as any).tipoCompraRetroceder || null;
      const negociosRestantes = prev.ventaEnCurso.negociosRestantes || [];

      agregarNotificacion(
        `${esClienteLoco ? "⏭️" : tipoCompraRetroceder ? "❌" : "❌"} ${
          propietario.nombre
        }${propietario.color ? ` (${propietario.color})` : ""} ${
          esClienteLoco ? "no vendió productos" : "canceló la venta"
        }`,
        esClienteLoco ? "info" : "alerta"
      );

      // Si es cliente loco, avanzar al siguiente negocio o terminar
      if (esClienteLoco && negociosRestantes.length > 0) {
        const siguienteNegocio = negociosRestantes[0];
        return {
          ...prev,
          fase: "vendiendo_productos" as FaseJuego,
          negocioActual: null,
          ventaEnCurso: {
            propietarioIndex: siguienteNegocio.propietarioIndex,
            negocioId: siguienteNegocio.negocioId,
            productosAVender: [],
            cantidadRequerida: 1,
            esClienteLoco: true,
            negociosRestantes: negociosRestantes.slice(1),
          },
        };
      }

      // Si es retroceder, volver a jugando
      if (tipoCompraRetroceder) {
        return {
          ...prev,
          fase: "jugando" as FaseJuego,
          negocioActual: null,
          ventaEnCurso: null,
        };
      }

      return {
        ...prev,
        fase: "jugando" as FaseJuego,
        negocioActual: null,
        ventaEnCurso: null,
      };
    });
  }, [setEstado, agregarNotificacion]);

  return {
    toggleProductoParaVender,
    confirmarVenta,
    cancelarVenta,
    calcularGananciaVenta,
  };
};
