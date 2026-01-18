import { EstadoJuego, Notificacion } from "./types/juego.types";
import { NEGOCIOS, PRODUCTOS } from "../types";

interface UseClienteLocoParams {
  estado: EstadoJuego;
  setEstado: React.Dispatch<React.SetStateAction<EstadoJuego>>;
  agregarNotificacion: (mensaje: string, tipo?: Notificacion["tipo"]) => void;
}

export const useClienteLoco = ({
  estado,
  setEstado,
  agregarNotificacion,
}: UseClienteLocoParams) => {
  const obtenerProductoIdBase = (productoIdConIndice: string) => {
    const partes = productoIdConIndice.split("_");
    const ultimaParte = partes[partes.length - 1];
    const tieneIndice = !isNaN(parseInt(ultimaParte)) && partes.length > 2;
    return tieneIndice ? partes.slice(0, -1).join("_") : productoIdConIndice;
  };

  const toggleProductoClienteLoco = (productoId: string) => {
    if (!estado.clienteLocoEnCurso || !estado.ventaEnCurso?.esClienteLoco)
      return;

    setEstado((prev) => {
      if (!prev.clienteLocoEnCurso || !prev.ventaEnCurso?.esClienteLoco)
        return prev;

      // Si el producto ya está seleccionado, lo deseleccionamos
      const yaSeleccionado = prev.productosSeleccionados.includes(productoId);
      const nuevaSeleccion = yaSeleccionado ? [] : [productoId];

      return {
        ...prev,
        productosSeleccionados: nuevaSeleccion,
        ventaEnCurso: {
          ...prev.ventaEnCurso,
          productosAVender: nuevaSeleccion,
        },
      };
    });
  };

  const confirmarVentaClienteLoco = () => {
    if (
      !estado.clienteLocoEnCurso ||
      estado.productosSeleccionados.length === 0
    )
      return;
    setEstado((prev) => {
      const clienteLocoEnCurso = prev.clienteLocoEnCurso;
      if (!clienteLocoEnCurso || !prev.ventaEnCurso?.esClienteLoco) return prev;

      const { negocioIndex, negociosConDueno, productosVendidos } =
        clienteLocoEnCurso;
      const negocioActual = negociosConDueno[negocioIndex];
      const productoSeleccionado = prev.productosSeleccionados[0];
      const productoIdBase = obtenerProductoIdBase(productoSeleccionado);
      const negocioIdActual = negocioActual.negocioId;

      const jugadorPropietario = prev.jugadores[negocioActual.propietarioIndex];

      // Buscar producto en productosComprados del jugador para este negocio
      const productoEnInventario = jugadorPropietario.productosComprados.find(
        (p) =>
          p.productoId === productoIdBase &&
          p.negocioId === negocioIdActual &&
          p.cantidad > 0
      );

      const producto = PRODUCTOS.find((p) => p.id === productoIdBase);

      if (!producto) {
        agregarNotificacion(`❌ Producto no encontrado`, "alerta");
        return prev;
      }

      if (!productoEnInventario || productoEnInventario.cantidad === 0) {
        agregarNotificacion(
          `❌ ${jugadorPropietario.nombre} no tiene stock de ${producto.nombre}`,
          "alerta"
        );
        return prev;
      }

      const precio = producto.precio;

      if (prev.dineroCliente < precio) {
        agregarNotificacion(
          `❌ El cliente no tiene suficiente dinero para comprar ${producto.nombre}`,
          "alerta"
        );
        return prev;
      }

      const nuevoDineroCliente = prev.dineroCliente - precio;

      agregarNotificacion(
        `🤪 ${jugadorPropietario.nombre} vendió ${producto.nombre} por $${precio} al Cliente Loco`,
        "exito"
      );

      const nuevosJugadores = prev.jugadores.map((j, idx) => {
        if (idx !== negocioActual.propietarioIndex) return j;

        return {
          ...j,
          dinero: j.dinero + precio,
          productosComprados: j.productosComprados.map((p) =>
            p.productoId === productoIdBase && p.negocioId === negocioIdActual
              ? { ...p, cantidad: p.cantidad - 1 }
              : p
          ),
        };
      });

      const nuevosProductosVendidos = [...productosVendidos, productoIdBase];
      const siguienteIndex = negocioIndex + 1;

      if (siguienteIndex < negociosConDueno.length) {
        const siguienteNegocio = negociosConDueno[siguienteIndex];
        const negocioDetalle =
          NEGOCIOS.find((n) => n.id === siguienteNegocio.negocioId) || null;

        return {
          ...prev,
          dineroCliente: nuevoDineroCliente,
          jugadores: nuevosJugadores,
          clienteLocoEnCurso: {
            negocioIndex: siguienteIndex,
            negociosConDueno,
            productosVendidos: nuevosProductosVendidos,
          },
          ventaEnCurso: {
            propietarioIndex: siguienteNegocio.propietarioIndex,
            negocioId: siguienteNegocio.negocioId,
            productosAVender: [],
            cantidadRequerida: 1,
            esClienteLoco: true,
            negociosRestantes: [],
          },
          productosSeleccionados: [],
          negocioActual: negocioDetalle,
          fase: "vendiendo_productos",
        };
      }

      agregarNotificacion(
        "✅ ¡Cliente Loco atendido! Todos los propietarios vendieron sus productos",
        "exito"
      );
      return {
        ...prev,
        dineroCliente: nuevoDineroCliente,
        jugadores: nuevosJugadores,
        clienteLocoEnCurso: null,
        ventaEnCurso: null,
        productosSeleccionados: [],
        negocioActual: null,
        fase: "jugando",
      };
    });
  };

  const saltarClienteLoco = () => {
    if (!estado.clienteLocoEnCurso) return;

    const { negocioIndex, negociosConDueno, productosVendidos } =
      estado.clienteLocoEnCurso;

    setEstado((prev) => {
      const clienteLocoEnCurso = prev.clienteLocoEnCurso;
      if (!clienteLocoEnCurso) return prev;

      const negocioActual = negociosConDueno[negocioIndex];
      const propietario = prev.jugadores[negocioActual.propietarioIndex];

      agregarNotificacion(
        `⏭️ ${propietario.nombre} decidió no vender al Cliente Loco`,
        "info"
      );

      // Avanzar al siguiente negocio sin vender nada
      const siguienteIndex = negocioIndex + 1;

      if (siguienteIndex < negociosConDueno.length) {
        // Hay más negocios, continuar
        const siguienteNegocio = negociosConDueno[siguienteIndex];
        const negocioDetalle =
          NEGOCIOS.find((n) => n.id === siguienteNegocio.negocioId) || null;
        return {
          ...prev,
          clienteLocoEnCurso: {
            negocioIndex: siguienteIndex,
            negociosConDueno,
            productosVendidos,
          },
          ventaEnCurso: {
            propietarioIndex: siguienteNegocio.propietarioIndex,
            negocioId: siguienteNegocio.negocioId,
            productosAVender: [],
            cantidadRequerida: 1,
            esClienteLoco: true,
            negociosRestantes: [],
          },
          productosSeleccionados: [],
          negocioActual: negocioDetalle,
          fase: "vendiendo_productos",
        };
      } else {
        // Terminamos con todos los negocios
        agregarNotificacion(
          "✅ Cliente Loco atendido (algunos propietarios no vendieron)",
          "info"
        );
        return {
          ...prev,
          clienteLocoEnCurso: null,
          ventaEnCurso: null,
          productosSeleccionados: [],
          negocioActual: null,
          fase: "jugando",
        };
      }
    });
  };

  return {
    toggleProductoClienteLoco,
    confirmarVentaClienteLoco,
    saltarClienteLoco,
  };
};
