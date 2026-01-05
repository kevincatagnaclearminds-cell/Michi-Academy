import { Producto } from "../../types";

export type CartaExpandida = {
  producto: Producto;
  indice: number;
  cartaId: string;
};

export const expandirCartasProducto = (
  productos: Producto[]
): CartaExpandida[] => {
  return productos.flatMap((producto) => {
    return Array.from({ length: producto.cantidad }, (_, i) => ({
      producto,
      indice: i,
      cartaId: `${producto.id}_${i}`,
    }));
  });
};
