import { PRODUCTO_REVERSO } from "../../types";

const cargarImagenesProductos = () => {
  const imagenes: Record<string, string> = {};
  // Nota: assets está al nivel de components, así que subimos dos niveles desde utils
  const context = import.meta.glob("../../assets/cartas/productos/*.jpg", {
    eager: true,
    as: "url",
  });

  Object.entries(context).forEach(([path, url]) => {
    const fileName = path.split("/").pop() || "";
    imagenes[fileName] = url as string;
  });

  return imagenes;
};

const IMAGENES_PRODUCTOS = cargarImagenesProductos();

export const getProductoImagenUrl = (imagenNombre: string): string => {
  return (
    IMAGENES_PRODUCTOS[imagenNombre] || IMAGENES_PRODUCTOS[PRODUCTO_REVERSO]
  );
};

export const getProductoReversoUrl = (): string => {
  return IMAGENES_PRODUCTOS[PRODUCTO_REVERSO];
};

export { IMAGENES_PRODUCTOS };
