/**
 * Hook para manejo de cartas incógnita (acciones sorpresa)
 */

import { useCallback } from "react";
import { NEGOCIOS, PRODUCTOS, Negocio } from "../types";
import { EstadoJuego, FaseJuego, Notificacion } from "./types/juego.types";
import { CONFIG_JUEGO } from "./constants/juego.constants";
import {
  getPosicionNegocio,
  getTodosNegociosComprados,
  buscarPropietarioNegocio,
  buscarNegocioPorCasilla,
  calcularDineroRestante,
  calcularPosicionRetroceso,
  getCasilla,
} from "./utils/juego.utils";
import { MENSAJES } from "./useNotificaciones";

interface UseCartasIncognitaParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

interface UseCartasIncognitaReturn {
  cerrarCartaIncognita: () => void;
}

export const useCartasIncognita = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseCartasIncognitaParams): UseCartasIncognitaReturn => {
  const procesarDineroPositivo = (
    dineroActual: number,
    valor: number
  ): number => {
    agregarNotificacion(MENSAJES.dineroPositivo(valor), "exito");
    return dineroActual + valor;
  };

  const procesarDineroNegativo = (
    dineroActual: number,
    valor: number
  ): number => {
    agregarNotificacion(MENSAJES.dineroNegativo(valor), "alerta");
    return calcularDineroRestante(dineroActual, valor);
  };

  const procesarIrNegocio = (
    negocioDestino: string,
    jugadores: EstadoJuego["jugadores"]
  ): {
    posicion: number;
    fase: FaseJuego;
    negocio: Negocio | null;
    mostrarModalNegocioNoComprado?: boolean;
  } => {
    const posicionNegocio = getPosicionNegocio(negocioDestino);
    if (posicionNegocio === -1) {
      return { posicion: -1, fase: "jugando", negocio: null };
    }

    const negocio = NEGOCIOS.find((n) => n.id === negocioDestino);
    agregarNotificacion(
      MENSAJES.irNegocio(negocio?.nombre || negocioDestino),
      "info"
    );

    const negociosComprados = getTodosNegociosComprados(jugadores);

    if (negocio && !negociosComprados.includes(negocio.id)) {
      return {
        posicion: posicionNegocio,
        fase: "carta_incognita",
        negocio,
        mostrarModalNegocioNoComprado: true,
      };
    }

    if (negocio) {
      const propietario = buscarPropietarioNegocio(jugadores, negocio.id);
      if (propietario) {
        agregarNotificacion(
          MENSAJES.negocioPropietario(propietario.nombre, propietario.color),
          "info"
        );
      }
    }

    return { posicion: posicionNegocio, fase: "jugando", negocio };
  };

  const procesarRetroceder = (
    posicionActual: number,
    casillas: number,
    jugadores: EstadoJuego["jugadores"]
  ): {
    posicion: number;
    fase: FaseJuego;
    negocio: Negocio | null;
    mostrarModalNegocioNoComprado?: boolean;
  } => {
    const nuevaPosicion = calcularPosicionRetroceso(posicionActual, casillas);
    agregarNotificacion(MENSAJES.retroceder(casillas), "info");

    const casillaDestino = getCasilla(nuevaPosicion);
    if (casillaDestino.tipo !== "tienda") {
      return { posicion: nuevaPosicion, fase: "jugando", negocio: null };
    }

    const negocioEnCasilla = buscarNegocioPorCasilla(nuevaPosicion);
    const negociosComprados = getTodosNegociosComprados(jugadores);

    if (negocioEnCasilla && !negociosComprados.includes(negocioEnCasilla.id)) {
      return {
        posicion: nuevaPosicion,
        fase: "carta_incognita",
        negocio: negocioEnCasilla,
        mostrarModalNegocioNoComprado: true,
      };
    }

    if (negocioEnCasilla) {
      const propietario = buscarPropietarioNegocio(
        jugadores,
        negocioEnCasilla.id
      );
      if (propietario) {
        agregarNotificacion(
          MENSAJES.cayoEnNegocio(
            negocioEnCasilla.nombre,
            propietario.nombre,
            propietario.color
          ),
          "info"
        );
      }
    }

    return { posicion: nuevaPosicion, fase: "jugando", negocio: null };
  };

  const procesarClienteLoco = (
    jugadores: EstadoJuego["jugadores"]
  ): {
    fase: FaseJuego;
    ventaEnCurso: EstadoJuego["ventaEnCurso"];
    clienteLocoEnCurso: EstadoJuego["clienteLocoEnCurso"];
  } => {
    const negociosConDueno: { propietarioIndex: number; negocioId: string }[] =
      [];

    jugadores.forEach((jugador, index) => {
      jugador.negociosComprados.forEach((negocioId) => {
        negociosConDueno.push({ propietarioIndex: index, negocioId });
      });
    });

    if (negociosConDueno.length === 0) {
      agregarNotificacion(MENSAJES.clienteLocoSinNegocios(), "info");
      return {
        fase: "jugando",
        ventaEnCurso: null,
        clienteLocoEnCurso: null,
      };
    }

    agregarNotificacion(
      "🤪 ¡Cliente Loco en el tablero! Cada propietario puede vender 1 producto",
      "info"
    );

    const primerNegocio = negociosConDueno[0];
    return {
      fase: "vendiendo_productos",
      ventaEnCurso: {
        propietarioIndex: primerNegocio.propietarioIndex,
        negocioId: primerNegocio.negocioId,
        productosAVender: [],
        cantidadRequerida: 1,
        esClienteLoco: true,
        negociosRestantes: [],
      },
      clienteLocoEnCurso: {
        negocioIndex: 0,
        negociosConDueno,
        productosVendidos: [],
      },
    };
  };

  const cerrarCartaIncognita = useCallback(() => {
    const carta = estado.cartaIncognitaActual;
    const jugador = estado.jugadores[estado.jugadorActual];

    if (!carta) {
      setEstado((prev) => ({
        ...prev,
        fase: "jugando" as FaseJuego,
        cartaIncognitaActual: null,
      }));
      return;
    }

    setEstado((prev) => {
      let nuevoDineroCliente = prev.dineroCliente;
      let nuevaPosicion = prev.posicionCliente;
      let nuevaFase: FaseJuego = "jugando";
      let nuevoNegocioActual: Negocio | null = null;
      let nuevosJugadores = prev.jugadores;
      let modalNegocioNoComprado = null;
      let modalProductosInsuficientes = null;
      let modalCompraForzada = null;
      let pasoRecarga = false;

      switch (carta.tipo) {
        case "dinero_positivo":
          if (carta.valor) {
            nuevoDineroCliente = procesarDineroPositivo(
              nuevoDineroCliente,
              carta.valor
            );
          }
          break;

        case "dinero_negativo":
          if (carta.valor) {
            nuevoDineroCliente = procesarDineroNegativo(
              nuevoDineroCliente,
              carta.valor
            );
          }
          break;

        case "ir_negocio":
          if (carta.negocioDestino) {
            const resultado = procesarIrNegocio(
              carta.negocioDestino,
              prev.jugadores
            );
            if (resultado.posicion !== -1) {
              nuevaPosicion = resultado.posicion;
              nuevaFase = resultado.fase;
              nuevoNegocioActual = resultado.negocio;

              if (nuevaPosicion < prev.posicionCliente) {
                pasoRecarga = true;
                nuevoDineroCliente += CONFIG_JUEGO.RECARGA_BANCO;
                agregarNotificacion(
                  MENSAJES.pasoRecarga(CONFIG_JUEGO.RECARGA_BANCO),
                  "exito"
                );
              }

              if (
                resultado.mostrarModalNegocioNoComprado &&
                resultado.negocio
              ) {
                modalNegocioNoComprado = {
                  nombreNegocio: resultado.negocio.nombre,
                };
              }

              // Si es carta de compra forzada (tiene producto específico)
              if (carta.productoEspecifico && resultado.fase === "jugando") {
                const negocioForzado =
                  resultado.negocio ||
                  NEGOCIOS.find((n) => n.id === carta.negocioDestino) ||
                  null;

                if (!negocioForzado) {
                  break;
                }

                // Mantener negocioActual para cualquier modal posterior
                nuevoNegocioActual = negocioForzado;

                const propietarioIndex = prev.jugadores.findIndex((j) =>
                  j.negociosComprados.includes(negocioForzado.id)
                );

                if (propietarioIndex === -1) {
                  // Negocio sin dueño: asegurar modal
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                    modalNegocioNoComprado: {
                      nombreNegocio: negocioForzado.nombre,
                    },
                  };
                }

                const propietario = prev.jugadores[propietarioIndex];
                const productoData = PRODUCTOS.find(
                  (p) => p.id === carta.productoEspecifico
                );

                if (!productoData) {
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                    modalProductoNoDisponible: {
                      nombreProducto: "Producto desconocido",
                      nombreNegocio: negocioForzado.nombre,
                      razon: "no_existe",
                    },
                  };
                }

                const productoComprado = propietario.productosComprados.find(
                  (p) =>
                    p.negocioId === negocioForzado.id &&
                    p.productoId === carta.productoEspecifico &&
                    p.cantidad > 0
                );

                if (!productoComprado) {
                  // Dueño sin stock del producto requerido
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                    modalProductoNoDisponible: {
                      nombreProducto: productoData.nombre,
                      nombreNegocio: negocioForzado.nombre,
                      razon: "sin_stock",
                      nombrePropietario: propietario.nombre,
                    },
                  };
                }

                if (nuevoDineroCliente < productoData.precio) {
                  // Cliente sin dinero suficiente, no compra
                  agregarNotificacion(
                    `❌ El cliente no tiene suficiente dinero para comprar ${productoData.nombre}`,
                    "alerta"
                  );
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                    modalProductoNoDisponible: {
                      nombreProducto: productoData.nombre,
                      nombreNegocio: negocioForzado.nombre,
                      razon: "sin_stock",
                      nombrePropietario: propietario.nombre,
                    },
                  };
                  break;
                }

                // Ejecutar compra forzada
                const dineroClienteFinal =
                  nuevoDineroCliente - productoData.precio;
                nuevosJugadores = prev.jugadores.map((jugador, idx) => {
                  if (idx !== propietarioIndex) return jugador;
                  return {
                    ...jugador,
                    dinero: jugador.dinero + productoData.precio,
                    productosComprados: jugador.productosComprados.map((p) =>
                      p.negocioId === productoComprado.negocioId &&
                      p.productoId === productoComprado.productoId
                        ? { ...p, cantidad: p.cantidad - 1 }
                        : p
                    ),
                  };
                });

                modalCompraForzada = {
                  nombreProducto: productoData.nombre,
                  precioProducto: productoData.precio,
                  nombreNegocio: negocioForzado.nombre,
                  nombrePropietario: propietario.nombre,
                  colorPropietario: propietario.color,
                  colorFondoPropietario: propietario.colorFondo,
                };

                nuevoDineroCliente = dineroClienteFinal;
              }
            }
          }
          break;

        case "retroceder":
          if (carta.valor) {
            const resultado = procesarRetroceder(
              prev.posicionCliente,
              carta.valor,
              prev.jugadores
            );
            nuevaPosicion = resultado.posicion;
            nuevaFase = resultado.fase;
            nuevoNegocioActual = resultado.negocio;

            if (resultado.mostrarModalNegocioNoComprado && resultado.negocio) {
              modalNegocioNoComprado = {
                nombreNegocio: resultado.negocio.nombre,
              };
            }

            if (
              carta.tipoCompra === "producto_mas_caro" ||
              carta.tipoCompra === "producto_mas_barato"
            ) {
              const negocioDestino = buscarNegocioPorCasilla(nuevaPosicion);
              const propietarioIndex = negocioDestino
                ? prev.jugadores.findIndex((j) =>
                    j.negociosComprados.includes(negocioDestino.id)
                  )
                : -1;

              if (negocioDestino && propietarioIndex !== -1) {
                const propietario = prev.jugadores[propietarioIndex];
                const productosDelNegocio =
                  propietario.productosComprados.filter(
                    (p) => p.negocioId === negocioDestino.id && p.cantidad > 0
                  );

                if (productosDelNegocio.length === 0) {
                  // No hay productos disponibles
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                    modalProductoNoDisponible: {
                      nombreProducto:
                        carta.tipoCompra === "producto_mas_caro"
                          ? "producto más costoso"
                          : "producto más barato",
                      nombreNegocio: negocioDestino.nombre,
                      razon: "sin_stock" as const,
                    },
                  };
                }

                // Buscar el producto más caro o más barato
                let productoSeleccionado = productosDelNegocio[0];
                let precioSeleccionado =
                  PRODUCTOS.find(
                    (p) => p.id === productoSeleccionado.productoId
                  )?.precio || 0;

                for (const prod of productosDelNegocio) {
                  const producto = PRODUCTOS.find(
                    (p) => p.id === prod.productoId
                  );
                  const precio = producto?.precio || 0;

                  if (carta.tipoCompra === "producto_mas_caro") {
                    if (precio > precioSeleccionado) {
                      productoSeleccionado = prod;
                      precioSeleccionado = precio;
                    }
                  } else {
                    if (precio < precioSeleccionado) {
                      productoSeleccionado = prod;
                      precioSeleccionado = precio;
                    }
                  }
                }

                const productoInfo = PRODUCTOS.find(
                  (p) => p.id === productoSeleccionado.productoId
                );

                if (!productoInfo) {
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                  };
                }

                // Verificar que el cliente tiene dinero
                if (nuevoDineroCliente < precioSeleccionado) {
                  agregarNotificacion(
                    `❌ El cliente no tiene suficiente dinero para comprar ${productoInfo.nombre}`,
                    "alerta"
                  );
                  return {
                    ...prev,
                    fase: "jugando",
                    dineroCliente: nuevoDineroCliente,
                    posicionCliente: nuevaPosicion,
                    cartaIncognitaActual: null,
                  };
                }

                // Realizar la compra automáticamente
                const dineroClienteFinal =
                  nuevoDineroCliente - precioSeleccionado;
                const nuevosJugadoresConCompra = prev.jugadores.map(
                  (jugador, idx) => {
                    if (idx !== propietarioIndex) return jugador;

                    return {
                      ...jugador,
                      dinero: jugador.dinero + precioSeleccionado,
                      productosComprados: jugador.productosComprados.map((p) =>
                        p.productoId === productoSeleccionado.productoId &&
                        p.negocioId === negocioDestino.id
                          ? { ...p, cantidad: p.cantidad - 1 }
                          : p
                      ),
                    };
                  }
                );

                agregarNotificacion(
                  `🛒 ¡Compra automática! El cliente compró ${productoInfo.nombre} por $${precioSeleccionado} en ${negocioDestino.nombre}`,
                  "exito"
                );

                return {
                  ...prev,
                  fase: "jugando",
                  dineroCliente: dineroClienteFinal,
                  posicionCliente: nuevaPosicion,
                  cartaIncognitaActual: null,
                  jugadores: nuevosJugadoresConCompra,
                  modalCompraAutomatica: {
                    nombreProducto: productoInfo.nombre,
                    precioProducto: precioSeleccionado,
                    nombreNegocio: negocioDestino.nombre,
                    nombrePropietario: propietario.nombre,
                    tipoProducto:
                      carta.tipoCompra === "producto_mas_caro"
                        ? "mas_caro"
                        : "mas_barato",
                  },
                };
              }
            }
          }
          break;

        case "cliente_loco":
          const resultadoLoco = procesarClienteLoco(prev.jugadores);
          const negocioClienteLoco = resultadoLoco.ventaEnCurso
            ? NEGOCIOS.find(
                (n) => n.id === resultadoLoco.ventaEnCurso!.negocioId
              ) || null
            : null;
          nuevaFase = resultadoLoco.fase;
          return {
            ...prev,
            fase: nuevaFase,
            dineroCliente: nuevoDineroCliente,
            posicionCliente: nuevaPosicion,
            negocioActual: negocioClienteLoco,
            cartaIncognitaActual: null,
            jugadores: nuevosJugadores,
            modalNegocioNoComprado,
            modalProductosInsuficientes,
            mensajeRecarga: pasoRecarga,
            ventaEnCurso: resultadoLoco.ventaEnCurso,
            clienteLocoEnCurso: resultadoLoco.clienteLocoEnCurso,
            productosSeleccionados: [],
          };
      }

      agregarNotificacion(
        MENSAJES.cartaEjecutada(jugador.nombre, jugador.color, carta.titulo),
        "exito"
      );

      return {
        ...prev,
        fase: nuevaFase,
        dineroCliente: nuevoDineroCliente,
        posicionCliente: nuevaPosicion,
        negocioActual: nuevoNegocioActual,
        cartaIncognitaActual: null,
        jugadores: nuevosJugadores,
        modalNegocioNoComprado,
        modalProductosInsuficientes,
        modalCompraForzada,
        mensajeRecarga: pasoRecarga,
      };
    });
  }, [
    estado.cartaIncognitaActual,
    estado.jugadores,
    estado.jugadorActual,
    setEstado,
    agregarNotificacion,
  ]);

  return { cerrarCartaIncognita };
};
