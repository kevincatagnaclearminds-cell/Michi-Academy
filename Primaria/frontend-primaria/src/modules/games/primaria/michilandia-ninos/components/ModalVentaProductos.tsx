import React, { useMemo, useState } from "react";
import { NEGOCIOS, PRODUCTOS, getImagenProducto } from "../types";
import { ProductoComprado } from "../hooks/types/juego.types";
import CartaNegocio from "./CartaNegocio";
import ModalShell from "./common/ModalShell";
import {
  getProductoImagenUrl,
  getProductoReversoUrl,
} from "./utils/productImages";
import "./ModalVentaProductos.css";

interface ModalVentaProductosProps {
  negocioId: string;
  propietarioNombre: string;
  propietarioColor: string;
  propietarioColorFondo: string;
  productosDelPropietario: ProductoComprado[];
  productosSeleccionados: string[];
  cantidadRequerida: number;
  dineroCliente: number;
  onToggleProducto: (productoId: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
}

interface CartaExpandida {
  cartaId: string;
  productoId: string;
  nombre: string;
  precio: number;
  imagen: string;
}

const ModalVentaProductos: React.FC<ModalVentaProductosProps> = ({
  negocioId,
  propietarioNombre,
  propietarioColor,
  propietarioColorFondo,
  productosDelPropietario,
  productosSeleccionados,
  cantidadRequerida,
  dineroCliente,
  onToggleProducto,
  onConfirmar,
  onCancelar,
}) => {
  const [cartasReveladas, setCartasReveladas] = useState<Set<string>>(
    new Set()
  );

  const negocio = NEGOCIOS.find((n) => n.id === negocioId);
  if (!negocio) return null;

  // Expandir los productos del propietario a cartas individuales
  const cartasDisponibles: CartaExpandida[] = useMemo(() => {
    const cartas: CartaExpandida[] = [];

    const productosDelNegocio = productosDelPropietario.filter(
      (p) => p.negocioId === negocioId && p.cantidad > 0
    );

    productosDelNegocio.forEach((productoComprado) => {
      const productoInfo = PRODUCTOS.find(
        (p) => p.id === productoComprado.productoId
      );
      if (!productoInfo) return;

      for (let i = 0; i < productoComprado.cantidad; i++) {
        cartas.push({
          cartaId: `${productoComprado.productoId}_${i}`,
          productoId: productoComprado.productoId,
          nombre: productoInfo.nombre,
          precio: productoInfo.precio,
          imagen: getImagenProducto(productoInfo, i),
        });
      }
    });

    return cartas;
  }, [productosDelPropietario, negocioId]);

  const seleccionCompleta = productosSeleccionados.length === cantidadRequerida;

  const gananciaTotal = useMemo(() => {
    return productosSeleccionados.reduce((total, cartaId) => {
      const carta = cartasDisponibles.find((c) => c.cartaId === cartaId);
      return total + (carta?.precio || 0);
    }, 0);
  }, [cartasDisponibles, productosSeleccionados]);

  const clientePuedeComprar = dineroCliente >= gananciaTotal;

  const handleMouseEnter = (cartaId: string) => {
    setCartasReveladas((prev) => {
      const next = new Set(prev);
      next.add(cartaId);
      return next;
    });
  };

  const handleMouseLeave = (cartaId: string) => {
    if (productosSeleccionados.includes(cartaId)) return;
    setCartasReveladas((prev) => {
      const next = new Set(prev);
      next.delete(cartaId);
      return next;
    });
  };

  const handleToggle = (cartaId: string) => {
    setCartasReveladas((prev) => {
      const next = new Set(prev);
      next.add(cartaId);
      return next;
    });
    onToggleProducto(cartaId);
  };

  return (
    <ModalShell
      overlayClassName="modal-venta-overlay"
      containerClassName="modal-venta-container"
      containerStyle={{ borderColor: propietarioColor }}
    >
      <div
        className="modal-venta-header"
        style={{ background: propietarioColorFondo }}
      >
        <h2>🛒 ¡El Cliente Quiere Comprar!</h2>
        <p>
          <strong>{propietarioNombre}</strong>, elige{" "}
          <strong>{cantidadRequerida} productos</strong> para vender
        </p>
      </div>

      <div className="modal-venta-content">
        <div className="modal-venta-negocio">
          <h3>📍 Tu Negocio</h3>
          <CartaNegocio negocioId={negocioId} revelada size="medium" />
          <div className="negocio-info">
            <span className="negocio-nombre">{negocio.nombre}</span>
          </div>
        </div>

        <div className="modal-venta-productos">
          <h3>📦 Tus Productos Disponibles ({cartasDisponibles.length})</h3>
          <p className="productos-instruccion">
            Selecciona exactamente {cantidadRequerida} productos. El cliente 🐱
            pagará el precio de venta de cada uno.
          </p>

          <div className="productos-venta-scroll">
            <div className="productos-venta-horizontal">
              {cartasDisponibles.map((carta) => {
                const estaSeleccionada = productosSeleccionados.includes(
                  carta.cartaId
                );
                const estaRevelada =
                  cartasReveladas.has(carta.cartaId) || estaSeleccionada;

                return (
                  <div
                    key={carta.cartaId}
                    className={`carta-venta-container ${
                      estaSeleccionada ? "seleccionada" : ""
                    }`}
                  >
                    <div
                      className={`carta-venta-flip ${
                        estaRevelada ? "revelada" : ""
                      }`}
                      onMouseEnter={() => handleMouseEnter(carta.cartaId)}
                      onMouseLeave={() => handleMouseLeave(carta.cartaId)}
                      onClick={() => handleToggle(carta.cartaId)}
                    >
                      <div className="carta-venta-cara carta-venta-reverso">
                        <img src={getProductoReversoUrl()} alt="Reverso" />
                        <div className="carta-venta-hint">
                          <span>👆</span>
                          <p>Pasa para ver</p>
                        </div>
                      </div>

                      <div className="carta-venta-cara carta-venta-frente">
                        <img
                          src={getProductoImagenUrl(carta.imagen)}
                          alt={carta.nombre}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              getProductoReversoUrl();
                          }}
                        />
                        {estaSeleccionada && (
                          <div className="carta-venta-check">
                            <span>✓</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="carta-venta-info">
                      <span className="producto-nombre">{carta.nombre}</span>
                      <span className="producto-precio">
                        💰 Precio: ${carta.precio}
                      </span>
                    </div>

                    <button
                      className={`btn-venta ${
                        estaSeleccionada ? "btn-quitar" : "btn-agregar"
                      }`}
                      onClick={() => handleToggle(carta.cartaId)}
                      disabled={
                        !estaSeleccionada &&
                        productosSeleccionados.length >= cantidadRequerida
                      }
                    >
                      {estaSeleccionada ? "❌ Quitar" : "✓ Seleccionar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-venta-footer">
        <div className="resumen-venta">
          <div className="resumen-item">
            <span>🐱 Dinero Cliente:</span>
            <span className="dinero-cliente">${dineroCliente}</span>
          </div>
          <div className="resumen-item">
            <span>🛒 Seleccionados:</span>
            <span
              className={`cantidad-seleccionada ${
                seleccionCompleta ? "completa" : ""
              }`}
            >
              {productosSeleccionados.length}/{cantidadRequerida}
            </span>
          </div>
          <div className="resumen-item">
            <span>💰 Ganarás:</span>
            <span
              className={`ganancia-total ${
                !clientePuedeComprar ? "insuficiente" : ""
              }`}
            >
              ${gananciaTotal}
            </span>
          </div>
        </div>

        <div className="acciones-venta">
          <button className="btn-cancelar-venta" onClick={onCancelar}>
            ❌ Cancelar Venta
          </button>
          <button
            className="btn-confirmar-venta"
            onClick={onConfirmar}
            disabled={!seleccionCompleta || !clientePuedeComprar}
          >
            ✓ Vender ({productosSeleccionados.length}/{cantidadRequerida})
          </button>
        </div>

        {!clientePuedeComprar && seleccionCompleta && (
          <p className="advertencia-dinero">
            ⚠️ El cliente no tiene suficiente dinero para esta compra
          </p>
        )}
      </div>
    </ModalShell>
  );
};

export default ModalVentaProductos;
