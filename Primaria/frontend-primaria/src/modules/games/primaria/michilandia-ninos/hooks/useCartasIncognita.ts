/**
 * Hook para manejo de cartas incógnita (acciones sorpresa)
 */

import { useCallback } from "react";
import { NEGOCIOS, Negocio } from "../types";
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

  /**
   * Procesa el efecto de dinero positivo
   */
  const procesarDineroPositivo = (
    dineroActual: number,
    valor: number
  ): number => {
    agregarNotificacion(MENSAJES.dineroPositivo(valor), "exito");
    return dineroActual + valor;
  };

  /**
   * Procesa el efecto de dinero negativo
   */
  const procesarDineroNegativo = (
    dineroActual: number,
    valor: number
  ): number => {
    agregarNotificacion(MENSAJES.dineroNegativo(valor), "alerta");
    return calcularDineroRestante(dineroActual, valor);
  };

  /**
   * Procesa ir a un negocio específico
   */
  const procesarIrNegocio = (
    negocioDestino: string,
    jugadores: EstadoJuego["jugadores"]
  ): { posicion: number; fase: FaseJuego; negocio: Negocio | null } => {
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

    // Negocio disponible para comprar
    if (negocio && !negociosComprados.includes(negocio.id)) {
      return { posicion: posicionNegocio, fase: "comprando", negocio };
    }

    // Negocio ya tiene dueño
    if (negocio) {
      const propietario = buscarPropietarioNegocio(jugadores, negocio.id);
      if (propietario) {
        agregarNotificacion(
          MENSAJES.negocioPropietario(propietario.emoji, propietario.nombre),
          "info"
        );
      }
    }

    return { posicion: posicionNegocio, fase: "jugando", negocio: null };
  };

  /**
   * Procesa retroceder casillas
   */
  const procesarRetroceder = (
    posicionActual: number,
    casillas: number,
    jugadores: EstadoJuego["jugadores"]
  ): { posicion: number; fase: FaseJuego; negocio: Negocio | null } => {
    const nuevaPosicion = calcularPosicionRetroceso(posicionActual, casillas);
    agregarNotificacion(MENSAJES.retroceder(casillas), "info");

    const casillaDestino = getCasilla(nuevaPosicion);

    if (casillaDestino.tipo !== "tienda") {
      return { posicion: nuevaPosicion, fase: "jugando", negocio: null };
    }

    const negocioEnCasilla = buscarNegocioPorCasilla(nuevaPosicion);
    const negociosComprados = getTodosNegociosComprados(jugadores);

    // Negocio disponible
    if (negocioEnCasilla && !negociosComprados.includes(negocioEnCasilla.id)) {
      return { posicion: nuevaPosicion, fase: "comprando", negocio: negocioEnCasilla };
    }

    // Negocio ya comprado
    if (negocioEnCasilla) {
      const propietario = buscarPropietarioNegocio(jugadores, negocioEnCasilla.id);
      if (propietario) {
        agregarNotificacion(
          MENSAJES.cayoEnNegocio(
            negocioEnCasilla.nombre,
            propietario.emoji,
            propietario.nombre
          ),
          "info"
        );
      }
    }

    return { posicion: nuevaPosicion, fase: "jugando", negocio: null };
  };

  /**
   * Procesa cliente loco
   */
  const procesarClienteLoco = (
    jugadores: EstadoJuego["jugadores"],
    dineroCliente: number
  ): { jugadores: EstadoJuego["jugadores"]; dinero: number; huboGasto: boolean } => {
    let gastoTotal = 0;

    const jugadoresActualizados = jugadores.map((j) => {
      const cantidadNegocios = j.negociosComprados.length;
      if (cantidadNegocios > 0) {
        const ganancia = cantidadNegocios * CONFIG_JUEGO.GASTO_CLIENTE_LOCO;
        gastoTotal += ganancia;
        agregarNotificacion(
          MENSAJES.clienteLocoGanancia(j.emoji, j.nombre, ganancia, cantidadNegocios),
          "exito"
        );
        return { ...j, dinero: j.dinero + ganancia };
      }
      return j;
    });

    if (gastoTotal > 0) {
      agregarNotificacion(MENSAJES.clienteLocoGasto(gastoTotal), "alerta");
      return {
        jugadores: jugadoresActualizados,
        dinero: calcularDineroRestante(dineroCliente, gastoTotal),
        huboGasto: true,
      };
    }

    agregarNotificacion(MENSAJES.clienteLocoSinNegocios(), "info");
    return { jugadores, dinero: dineroCliente, huboGasto: false };
  };

  /**
   * Cierra la carta incógnita y ejecuta su efecto
   */
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

      switch (carta.tipo) {
        case "dinero_positivo":
          if (carta.valor) {
            nuevoDineroCliente = procesarDineroPositivo(nuevoDineroCliente, carta.valor);
          }
          break;

        case "dinero_negativo":
          if (carta.valor) {
            nuevoDineroCliente = procesarDineroNegativo(nuevoDineroCliente, carta.valor);
          }
          break;

        case "ir_negocio":
          if (carta.negocioDestino) {
            const resultado = procesarIrNegocio(carta.negocioDestino, prev.jugadores);
            if (resultado.posicion !== -1) {
              nuevaPosicion = resultado.posicion;
              nuevaFase = resultado.fase;
              nuevoNegocioActual = resultado.negocio;
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
          }
          break;

        case "cliente_loco":
          const resultadoLoco = procesarClienteLoco(prev.jugadores, prev.dineroCliente);
          nuevosJugadores = resultadoLoco.jugadores;
          nuevoDineroCliente = resultadoLoco.dinero;
          break;
      }

      agregarNotificacion(
        MENSAJES.cartaEjecutada(jugador.emoji, carta.titulo),
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
      };
    });
  }, [
    estado.cartaIncognitaActual,
    estado.jugadores,
    estado.jugadorActual,
    setEstado,
    agregarNotificacion,
  ]);

  return {
    cerrarCartaIncognita,
  };
};

