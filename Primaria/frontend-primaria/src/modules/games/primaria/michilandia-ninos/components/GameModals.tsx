import React from "react";
import { NEGOCIOS } from "../types";
import ModalCompra from "./ModalCompra";
import ModalCompraProductos from "./ModalCompraProductos";
import ModalVentaProductos from "./ModalVentaProductos";
import ModalInversion from "./ModalInversion";
import ModalNegocioDetalle from "./ModalNegocioDetalle";
import ModalInstrucciones from "./ModalInstrucciones";
import ModalCartaIncognita from "./ModalCartaIncognita";
import ConfirmModal from "./ConfirmModal";
import { ModalProductosInsuficientes } from "./ModalProductosInsuficientes";
import { ModalNegocioNoComprado } from "./ModalNegocioNoComprado";
import { ModalProductoNoDisponible } from "./ModalProductoNoDisponible";
import { ModalCompraAutomatica } from "./ModalCompraAutomatica";
import { ModalCompraForzada } from "./ModalCompraForzada.tsx";
import ModalSubasta from "./ModalSubasta";
import ModalGanadores from "./ModalGanadores";
import type { Jugador, SubastaJugadorInfo } from "../hooks/types/juego.types";

interface GameModalsProps {
  estado: any;
  jugadorActual: Jugador;
  negocioDetalle: string | null;
  mostrarInstrucciones: boolean;
  mostrarModalAbandonar: boolean;
  mostrarModalFinalizar: boolean;
  dineroCliente: number;
  onCloseNegocio: () => void;
  onSetMostrarInstrucciones: (v: boolean) => void;
  onConfirmAbandonar: () => void;
  onCancelAbandonar: () => void;
  onConfirmFinalizar: () => void;
  onCancelFinalizar: () => void;
  onComprarNegocio: () => void;
  onRechazarCompra: () => void;
  onToggleProductoSeleccionado: (id: string) => void;
  onConfirmarCompraProductos: () => void;
  onSaltarCompraProductos: () => void;
  onToggleProductoParaVender: (id: string) => void;
  onConfirmarVenta: () => void;
  onCancelarVenta: () => void;
  onToggleProductoInversion: (id: string) => void;
  onConfirmarInversion: () => void;
  onSaltarInversion: () => void;
  onToggleProductoClienteLoco: (id: string) => void;
  onConfirmarVentaClienteLoco: () => void;
  onSaltarClienteLoco: () => void;
  cerrarCartaIncognita: () => void;
  cerrarModalProductosInsuficientes: () => void;
  cerrarModalNegocioNoComprado: () => void;
  cerrarModalProductoNoDisponible: () => void;
  cerrarModalCompraAutomatica: () => void;
  cerrarModalCompraForzada: () => void;
  onPujarSubasta: (inc: number) => void;
  onRetirarseSubasta: () => void;
  onCerrarGanadores: () => void;
}

const GameModals: React.FC<GameModalsProps> = ({
  estado,
  jugadorActual,
  negocioDetalle,
  mostrarInstrucciones,
  mostrarModalAbandonar,
  mostrarModalFinalizar,
  dineroCliente,
  onCloseNegocio,
  onSetMostrarInstrucciones,
  onConfirmAbandonar,
  onCancelAbandonar,
  onConfirmFinalizar,
  onCancelFinalizar,
  onComprarNegocio,
  onRechazarCompra,
  onToggleProductoSeleccionado,
  onConfirmarCompraProductos,
  onSaltarCompraProductos,
  onToggleProductoParaVender,
  onConfirmarVenta,
  onCancelarVenta,
  onToggleProductoInversion,
  onConfirmarInversion,
  onSaltarInversion,
  onToggleProductoClienteLoco,
  onConfirmarVentaClienteLoco,
  onSaltarClienteLoco,
  cerrarCartaIncognita,
  cerrarModalProductosInsuficientes,
  cerrarModalNegocioNoComprado,
  cerrarModalProductoNoDisponible,
  cerrarModalCompraAutomatica,
  cerrarModalCompraForzada,
  onPujarSubasta,
  onRetirarseSubasta,
  onCerrarGanadores,
}) => {
  const propietarioNegocioDetalle = estado.jugadores.find((j: Jugador) =>
    j.negociosComprados.includes(negocioDetalle || "")
  );

  // Fallback defensivo: si estamos vendiendo y se perdió negocioActual, derivarlo del ventaEnCurso
  const negocioEnVenta =
    estado.negocioActual ||
    (estado.ventaEnCurso
      ? NEGOCIOS.find((n) => n.id === estado.ventaEnCurso.negocioId) || null
      : null);

  const propietarioNombre =
    propietarioNegocioDetalle?.nombre || jugadorActual?.nombre || "";
  const propietarioColor =
    propietarioNegocioDetalle?.color || jugadorActual?.color || "#4ECDC4";
  const propietarioColorFondo =
    propietarioNegocioDetalle?.colorFondo || jugadorActual?.colorFondo || "";
  const productosDelPropietario =
    propietarioNegocioDetalle?.productosComprados ||
    jugadorActual?.productosComprados ||
    [];

  return (
    <>
      {estado.fase === "comprando" && estado.negocioActual && (
        <ModalCompra
          negocio={estado.negocioActual}
          dineroJugador={jugadorActual?.dinero || 0}
          onComprar={onComprarNegocio}
          onRechazar={onRechazarCompra}
          jugadorNombre={jugadorActual?.nombre}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.fase === "comprando_productos" && estado.negocioActual && (
        <ModalCompraProductos
          negocio={estado.negocioActual}
          dineroJugador={jugadorActual?.dinero || 0}
          productosSeleccionados={estado.productosSeleccionados}
          productosYaComprados={jugadorActual?.productosComprados || []}
          onToggleProducto={onToggleProductoSeleccionado}
          onConfirmar={onConfirmarCompraProductos}
          onSaltar={onSaltarCompraProductos}
          jugadorNombre={jugadorActual?.nombre}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.fase === "vendiendo_productos" &&
        estado.ventaEnCurso &&
        negocioEnVenta &&
        (() => {
          const propietario =
            estado.jugadores[estado.ventaEnCurso.propietarioIndex];
          const esClienteLoco = estado.ventaEnCurso.esClienteLoco || false;

          return (
            <ModalVentaProductos
              negocioId={estado.ventaEnCurso.negocioId}
              propietarioNombre={propietario?.nombre || ""}
              propietarioColor={propietario?.color || "#4ECDC4"}
              propietarioColorFondo={propietario?.colorFondo || ""}
              productosDelPropietario={propietario?.productosComprados || []}
              productosSeleccionados={
                esClienteLoco
                  ? estado.productosSeleccionados
                  : estado.ventaEnCurso.productosAVender
              }
              cantidadRequerida={estado.ventaEnCurso.cantidadRequerida}
              dineroCliente={dineroCliente}
              onToggleProducto={
                esClienteLoco
                  ? onToggleProductoClienteLoco
                  : onToggleProductoParaVender
              }
              onConfirmar={
                esClienteLoco ? onConfirmarVentaClienteLoco : onConfirmarVenta
              }
              onCancelar={esClienteLoco ? onSaltarClienteLoco : onCancelarVenta}
            />
          );
        })()}

      {negocioDetalle && (
        <ModalNegocioDetalle
          negocioId={negocioDetalle}
          propietarioNombre={propietarioNombre}
          propietarioColor={propietarioColor}
          propietarioColorFondo={propietarioColorFondo}
          productosDelJugador={productosDelPropietario}
          onClose={onCloseNegocio}
        />
      )}

      {mostrarInstrucciones && (
        <ModalInstrucciones
          onClose={() => onSetMostrarInstrucciones(false)}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.fase === "carta_incognita" && estado.cartaIncognitaActual && (
        <ModalCartaIncognita
          carta={estado.cartaIncognitaActual}
          onCerrar={cerrarCartaIncognita}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.fase === "invirtiendo" && estado.inversionEnCurso && (
        <ModalInversion
          inversionEnCurso={estado.inversionEnCurso}
          jugadores={estado.jugadores as Jugador[]}
          productosSeleccionados={estado.productosSeleccionados}
          onToggleProducto={onToggleProductoInversion}
          onConfirmar={onConfirmarInversion}
          onSaltar={onSaltarInversion}
        />
      )}

      {mostrarModalAbandonar && (
        <ConfirmModal
          title="Abandonar partida"
          message="¿Estás seguro que quieres abandonar la partida? Se perderá el progreso actual."
          onCancel={onCancelAbandonar}
          onConfirm={onConfirmAbandonar}
          confirmLabel="Abandonar"
          cancelLabel="Cancelar"
        />
      )}

      {mostrarModalFinalizar && (
        <ConfirmModal
          title="Finalizar partida"
          message="¿Deseas finalizar la partida ahora? Se mostrará el resumen y volverás al inicio."
          onCancel={onCancelFinalizar}
          onConfirm={onConfirmFinalizar}
          confirmLabel="Finalizar"
          cancelLabel="Cancelar"
        />
      )}

      {estado.modalProductosInsuficientes && (
        <ModalProductosInsuficientes
          isOpen={true}
          onClose={cerrarModalProductosInsuficientes}
          nombreJugador={estado.modalProductosInsuficientes.nombreJugador}
          productosActuales={
            estado.modalProductosInsuficientes.productosActuales
          }
          jugadorColor={estado.modalProductosInsuficientes.jugadorColor}
          jugadorColorFondo={
            estado.modalProductosInsuficientes.jugadorColorFondo
          }
        />
      )}

      {estado.modalNegocioNoComprado && (
        <ModalNegocioNoComprado
          isOpen={true}
          onClose={cerrarModalNegocioNoComprado}
          nombreNegocio={estado.modalNegocioNoComprado.nombreNegocio}
          jugadorNombre={jugadorActual?.nombre}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.modalProductoNoDisponible && (
        <ModalProductoNoDisponible
          isOpen={true}
          onClose={cerrarModalProductoNoDisponible}
          nombreProducto={estado.modalProductoNoDisponible.nombreProducto}
          nombreNegocio={estado.modalProductoNoDisponible.nombreNegocio}
          razon={estado.modalProductoNoDisponible.razon}
          nombrePropietario={estado.modalProductoNoDisponible.nombrePropietario}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.modalCompraAutomatica && (
        <ModalCompraAutomatica
          isOpen={true}
          onClose={cerrarModalCompraAutomatica}
          nombreProducto={estado.modalCompraAutomatica.nombreProducto}
          precioProducto={estado.modalCompraAutomatica.precioProducto}
          nombreNegocio={estado.modalCompraAutomatica.nombreNegocio}
          nombrePropietario={estado.modalCompraAutomatica.nombrePropietario}
          tipoProducto={estado.modalCompraAutomatica.tipoProducto}
          jugadorColor={jugadorActual?.color}
          jugadorColorFondo={jugadorActual?.colorFondo}
        />
      )}

      {estado.modalCompraForzada && (
        <ModalCompraForzada
          isOpen={true}
          onClose={cerrarModalCompraForzada}
          nombreProducto={estado.modalCompraForzada.nombreProducto}
          precioProducto={estado.modalCompraForzada.precioProducto}
          nombreNegocio={estado.modalCompraForzada.nombreNegocio}
          nombrePropietario={estado.modalCompraForzada.nombrePropietario}
          colorPropietario={estado.modalCompraForzada.colorPropietario}
          colorFondoPropietario={
            estado.modalCompraForzada.colorFondoPropietario
          }
        />
      )}

      {estado.fase === "subastando" &&
        estado.subastaEnCurso &&
        estado.negocioActual && (
          <ModalSubasta
            negocio={estado.subastaEnCurso.negocio}
            jugadorEnTurno={
              estado.jugadores[estado.subastaEnCurso.turnoIndex] as Jugador
            }
            pujaActual={estado.subastaEnCurso.pujaActual}
            liderNombre={
              estado.subastaEnCurso.lider
                ? estado.jugadores[estado.subastaEnCurso.lider.jugadorIndex]
                    ?.nombre
                : undefined
            }
            participantes={estado.subastaEnCurso.jugadores.map(
              (p: SubastaJugadorInfo) => {
                const jug = estado.jugadores[p.jugadorIndex] as Jugador;
                return {
                  jugador: jug,
                  monto: p.monto,
                  estado: p.estado,
                  esTurno: p.jugadorIndex === estado.subastaEnCurso.turnoIndex,
                  esLider:
                    !!estado.subastaEnCurso.lider &&
                    estado.subastaEnCurso.lider.jugadorIndex === p.jugadorIndex,
                };
              }
            )}
            onPujar5={() => onPujarSubasta(5)}
            onPujar10={() => onPujarSubasta(10)}
            onPujar25={() => onPujarSubasta(25)}
            onRetirarse={onRetirarseSubasta}
          />
        )}

      {estado.modalGanadores && (
        <ModalGanadores
          jugadores={estado.jugadores as Jugador[]}
          jugadoresRetirados={estado.jugadoresRetirados as Jugador[]}
          motivo={estado.modalGanadores.motivo}
          onClose={onCerrarGanadores}
        />
      )}
    </>
  );
};

export default GameModals;
