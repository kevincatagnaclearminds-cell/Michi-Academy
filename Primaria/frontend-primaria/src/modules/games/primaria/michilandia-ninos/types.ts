// Tipos para el juego MichiLandia

export type CasillaType =
  | "esquina-inicio"
  | "esquina-invertir"
  | "esquina-recargar"
  | "esquina-meta"
  | "tienda"
  | "evento";

export type CategoriaColor =
  | "amarillo" // Comida rápida
  | "naranja" // Frutas/Verduras
  | "verde" // Granos
  | "rojo" // Carnicería
  | "azul-marino" // Marisquería
  | "rosa" // Farmacia/Ropa
  | "morado" // Ferretería
  | "celeste" // Mascotas
  | "verde-claro" // Juguetería
  | "azul" // Tecnología
  | "especial"; // Casillas de evento

export interface Casilla {
  id: number;
  nombre: string;
  tipo: CasillaType;
  categoria?: CategoriaColor;
  emoji: string;
  lado: "top" | "right" | "bottom" | "left" | "corner";
  posicion: number;
  negocioId?: string; // ID para mapear con la imagen del negocio
}

// ====== NEGOCIOS ======
export interface Negocio {
  id: string;
  nombre: string;
  precio: number;
  casillaId: number;
  propietario: "jugador" | "banco" | null; // null = no comprado
}

// Configuración de precios de negocios (según las cartas)
export const NEGOCIOS: Negocio[] = [
  // Lado izquierdo
  {
    id: "marisqueria",
    nombre: "Marisquería",
    precio: 150,
    casillaId: 1,
    propietario: null,
  },
  {
    id: "carniceria",
    nombre: "Carnicería",
    precio: 125,
    casillaId: 2,
    propietario: null,
  },
  {
    id: "granos",
    nombre: "Granos y Cereales",
    precio: 100,
    casillaId: 4,
    propietario: null,
  },
  {
    id: "fruteria",
    nombre: "Frutería",
    precio: 50,
    casillaId: 5,
    propietario: null,
  },

  // Lado superior
  {
    id: "panaderia",
    nombre: "Panadería",
    precio: 100,
    casillaId: 7,
    propietario: null,
  },
  {
    id: "pizzeria",
    nombre: "Pizzería",
    precio: 175,
    casillaId: 8,
    propietario: null,
  },
  {
    id: "heladeria",
    nombre: "Heladería",
    precio: 75,
    casillaId: 10,
    propietario: null,
  },
  {
    id: "comida_rapida",
    nombre: "Comida Rápida",
    precio: 125,
    casillaId: 11,
    propietario: null,
  },

  // Lado derecho
  {
    id: "celulares",
    nombre: "Celulares",
    precio: 400,
    casillaId: 13,
    propietario: null,
  },
  {
    id: "tecnologia",
    nombre: "Tecnología",
    precio: 425,
    casillaId: 14,
    propietario: null,
  },
  {
    id: "jugueteria",
    nombre: "Juguetería",
    precio: 250,
    casillaId: 16,
    propietario: null,
  },
  {
    id: "papeleria",
    nombre: "Papelería",
    precio: 75,
    casillaId: 17,
    propietario: null,
  },

  // Lado inferior
  {
    id: "mascotas",
    nombre: "Tienda de Mascotas",
    precio: 125,
    casillaId: 19,
    propietario: null,
  },
  {
    id: "ferreteria",
    nombre: "Ferretería",
    precio: 175,
    casillaId: 20,
    propietario: null,
  },
  {
    id: "ropa",
    nombre: "Tienda de Ropa",
    precio: 300,
    casillaId: 22,
    propietario: null,
  },
  {
    id: "farmacia",
    nombre: "Farmacia",
    precio: 125,
    casillaId: 23,
    propietario: null,
  },
];

// ====== CARTAS INCÓGNITA ======
export type TipoCartaIncognita =
  | "dinero_positivo"
  | "dinero_negativo"
  | "ir_negocio"
  | "retroceder"
  | "cliente_loco";

export type TipoCompraRetroceso =
  | "producto_mas_caro"
  | "producto_mas_barato"
  | "producto_especifico";

export interface CartaIncognita {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: TipoCartaIncognita;
  valor?: number; // Cantidad de dinero o casillas
  negocioDestino?: string; // ID del negocio destino
  productoEspecifico?: string; // ID del producto específico a comprar
  tipoCompra?: TipoCompraRetroceso; // Tipo de compra en retroceso
  imagen: string; // Nombre del archivo de imagen
}

// Imágenes de las cartas
export const CARTA_TRASERA = "Tarjetas Incognitas Michipolio_page-0018.jpg";

export const CARTAS_INCOGNITA: CartaIncognita[] = [
  // Cartas de dinero positivo
  {
    id: 1,
    titulo: "Herencia Michi",
    descripcion:
      "El Cliente recibe $300 gracias a una herencia inesperada de su tía Carlota",
    tipo: "dinero_positivo",
    valor: 300,
    imagen: "Tarjetas Incognitas Michipolio_page-0001.jpg",
  },
  {
    id: 2,
    titulo: "Inversión que Dio Frutos",
    descripcion: "El Cliente gana $200 por una inversión exitosa",
    tipo: "dinero_positivo",
    valor: 200,
    imagen: "Tarjetas Incognitas Michipolio_page-0002.jpg",
  },

  // Carta de dinero negativo
  {
    id: 3,
    titulo: "Donación Solidaria",
    descripcion:
      "El Cliente dona $100 al banco MichiLandia para apoyar una causa benéfica",
    tipo: "dinero_negativo",
    valor: 100,
    imagen: "Tarjetas Incognitas Michipolio_page-0003.jpg",
  },

  // Cartas de ir a negocio específico
  {
    id: 4,
    titulo: "Tiene Hambre",
    descripcion:
      "Avanza hasta la comida rápida más cercana y compra un Combo Goloso",
    tipo: "ir_negocio",
    negocioDestino: "comida_rapida",
    productoEspecifico: "comida_combo",
    imagen: "Tarjetas Incognitas Michipolio_page-0004.jpg",
  },
  {
    id: 5,
    titulo: "Antojo de Algo Dulce",
    descripcion: "Avanza a la Heladería y compra un helado Spacial",
    tipo: "ir_negocio",
    negocioDestino: "heladeria",
    productoEspecifico: "heladeria_especial",
    imagen: "Tarjetas Incognitas Michipolio_page-0005.jpg",
  },
  {
    id: 6,
    titulo: "Hora de Cocinar",
    descripcion: "Avanza hasta Granos y Cereales y compra Michi Arroz",
    tipo: "ir_negocio",
    negocioDestino: "granos",
    productoEspecifico: "granos_arroz",
    imagen: "Tarjetas Incognitas Michipolio_page-0006.jpg",
  },
  {
    id: 7,
    titulo: "Nueva Temporada de Ropa",
    descripcion: "Avanza hasta la tienda de ropa y compra una Chaqueta Gatuna",
    tipo: "ir_negocio",
    negocioDestino: "ropa",
    productoEspecifico: "ropa_chaqueta",
    imagen: "Tarjetas Incognitas Michipolio_page-0007.jpg",
  },
  {
    id: 8,
    titulo: "Dolor de Cabeza",
    descripcion: "Avanza hasta la Farmacia y compra un Jarabe Felino",
    tipo: "ir_negocio",
    negocioDestino: "farmacia",
    productoEspecifico: "farmacia_jarabe_1",
    imagen: "Tarjetas Incognitas Michipolio_page-0008.jpg",
  },
  {
    id: 9,
    titulo: "Hora de Jugar",
    descripcion: "Avanza hasta la Juguetería y compra un robot felino",
    tipo: "ir_negocio",
    negocioDestino: "jugueteria",
    productoEspecifico: "jugueteria_robot",
    imagen: "Tarjetas Incognitas Michipolio_page-0009.jpg",
  },
  {
    id: 10,
    titulo: "Necesita Comer Sano",
    descripcion: "Avanza hasta la frutería y compra una Michi Sandía",
    tipo: "ir_negocio",
    negocioDestino: "fruteria",
    productoEspecifico: "fruteria_sandia_1",
    imagen: "Tarjetas Incognitas Michipolio_page-0010.jpg",
  },
  {
    id: 11,
    titulo: "Vuelta a Clases",
    descripcion: "Avanza hasta la Papelería y compra una Mochila Gatuna",
    tipo: "ir_negocio",
    negocioDestino: "papeleria",
    productoEspecifico: "papeleria_mochila",
    imagen: "Tarjetas Incognitas Michipolio_page-0011.jpg",
  },

  // Cartas de retroceder
  {
    id: 12,
    titulo: "Retrocede 2 Casillas - Producto Más Costoso",
    descripcion:
      "El Cliente compra el producto más caro disponible del negocio donde cae",
    tipo: "retroceder",
    valor: 2,
    tipoCompra: "producto_mas_caro",
    imagen: "Tarjetas Incognitas Michipolio_page-0012.jpg",
  },
  {
    id: 13,
    titulo: "Retrocede 1 Casilla - Producto Más Barato",
    descripcion:
      "El Cliente compra el producto más barato disponible del negocio donde cae",
    tipo: "retroceder",
    valor: 1,
    tipoCompra: "producto_mas_barato",
    imagen: "Tarjetas Incognitas Michipolio_page-0013.jpg",
  },
  {
    id: 14,
    titulo: "Retrocede 2 Casillas - Gran Compra",
    descripcion: "El Cliente compra el producto más económico disponible",
    tipo: "retroceder",
    valor: 2,
    tipoCompra: "producto_mas_barato",
    imagen: "Tarjetas Incognitas Michipolio_page-0014.jpg",
  },
  {
    id: 15,
    titulo: "Retrocede 1 Casilla - Lujo Michi Premium",
    descripcion: "El Cliente compra el producto más costoso que encuentre",
    tipo: "retroceder",
    valor: 1,
    tipoCompra: "producto_mas_caro",
    imagen: "Tarjetas Incognitas Michipolio_page-0015.jpg",
  },
  {
    id: 16,
    titulo: "Retrocede 2 Casillas - Oferta Irresistible",
    descripcion:
      "El Cliente decidió darse un lujo y compra el producto más costoso",
    tipo: "retroceder",
    valor: 2,
    tipoCompra: "producto_mas_caro",
    imagen: "Tarjetas Incognitas Michipolio_page-0016.jpg",
  },

  // Carta especial
  {
    id: 17,
    titulo: "El Cliente se Vuelve Loco",
    descripcion:
      "Compra 1 producto en todos los negocios. Cada dueño elige qué producto vender",
    tipo: "cliente_loco",
    imagen: "Tarjetas Incognitas Michipolio_page-0017.jpg",
  },
];

// ====== PRODUCTOS ======
export interface Producto {
  id: string;
  nombre: string;
  negocioId: string;
  costo: number; // COSTO: Lo que el jugador paga para comprar el producto
  precio: number; // PRECIO: Lo que el cliente paga (precio de venta)
  imagen: string; // Imagen de la primera carta
  imagen2?: string; // Imagen de la segunda carta (solo si cantidad = 2)
  cantidad: number; // Cantidad disponible (1 o 2 según las cartas)
}

// Función helper para obtener la imagen correcta según el índice
export const getImagenProducto = (
  producto: Producto,
  indice: number
): string => {
  if (indice === 1 && producto.imagen2) {
    return producto.imagen2;
  }
  return producto.imagen;
};

export const PRODUCTO_REVERSO = "0000_tarjeta_productos_michipolio_reverso.jpg";

// Mapeo de productos por negocio basado en los assets
// PRECIOS ACTUALIZADOS SEGÚN LAS TARJETAS ORIGINALES
// Productos con cantidad 2 tienen imagen2 para la segunda carta
export const PRODUCTOS: Producto[] = [
  // === MARISQUERÍA (6 productos) ===
  {
    id: "marisqueria_pescado_1",
    nombre: "Pescado Felino",
    negocioId: "marisqueria",
    costo: 8,
    precio: 12,
    imagen: "0001_tarjeta_productos_michipolio_marisqueria_pescado_felino.jpg",
    imagen2:
      "0002_tarjeta_productos_michipolio_marisqueria_pescado_felino_2.jpg",
    cantidad: 2,
  },
  {
    id: "marisqueria_camarones_1",
    nombre: "Michi Camarones",
    negocioId: "marisqueria",
    costo: 10,
    precio: 15,
    imagen: "0003_tarjeta_productos_michipolio_marisqueria_michi_camarones.jpg",
    imagen2:
      "0004_tarjeta_productos_michipolio_marisqueria_michi_camarones_2.jpg",
    cantidad: 2,
  },
  {
    id: "marisqueria_pulpo",
    nombre: "Pulpo Gatuno",
    negocioId: "marisqueria",
    costo: 12,
    precio: 18,
    imagen: "0005_tarjeta_productos_michipolio_marisqueria_pulpo_gatuno.jpg",
    cantidad: 1,
  },
  {
    id: "marisqueria_langosta",
    nombre: "Michi Langosta",
    negocioId: "marisqueria",
    costo: 15,
    precio: 22,
    imagen: "0006_tarjeta_productos_michipolio_marisqueria_michi_langosta.jpg",
    cantidad: 1,
  },

  // === CARNICERÍA (6 productos) ===
  {
    id: "carniceria_pollo_1",
    nombre: "Pollo Felino",
    negocioId: "carniceria",
    costo: 6,
    precio: 9,
    imagen: "0007_tarjeta_productos_michipolio_carniceria_pollo_felino.jpg",
    imagen2: "0008_tarjeta_productos_michipolio_carniceria_pollo_felino_2.jpg",
    cantidad: 2,
  },
  {
    id: "carniceria_chuleta_1",
    nombre: "Michi Chuleta",
    negocioId: "carniceria",
    costo: 8,
    precio: 12,
    imagen: "0009_tarjeta_productos_michipolio_carniceria_michi_chuleta.jpg",
    imagen2: "0010_tarjeta_productos_michipolio_carniceria_michi_chuleta_2.jpg",
    cantidad: 2,
  },
  {
    id: "carniceria_carne_molida",
    nombre: "Carne Molida Gatuna",
    negocioId: "carniceria",
    costo: 10,
    precio: 14,
    imagen:
      "0011_tarjeta_productos_michipolio_carniceria_carne_molida_gatuna.jpg",
    cantidad: 1,
  },
  {
    id: "carniceria_costilla",
    nombre: "Michi Costilla",
    negocioId: "carniceria",
    costo: 12,
    precio: 18,
    imagen: "0012_tarjeta_productos_michipolio_carniceria_michi_costilla.jpg",
    cantidad: 1,
  },

  // === GRANOS Y CEREALES (6 productos) ===
  {
    id: "granos_avena_1",
    nombre: "Avena Felina",
    negocioId: "granos",
    costo: 2,
    precio: 3,
    imagen:
      "0013_tarjeta_productos_michipolio_granos_y_cereales_avena_felina.jpg",
    imagen2:
      "0014_tarjeta_productos_michipolio_granos_y_cereales_avena_felina_2.jpg",
    cantidad: 2,
  },
  {
    id: "granos_lenteja_1",
    nombre: "Michi Lenteja",
    negocioId: "granos",
    costo: 4,
    precio: 6,
    imagen:
      "0015_tarjeta_productos_michipolio_granos_y_cereales_michi_lenteja.jpg",
    imagen2:
      "0016_tarjeta_productos_michipolio_granos_y_cereales_michi_lenteja_2.jpg",
    cantidad: 2,
  },
  {
    id: "granos_maiz",
    nombre: "Maíz Gatuno",
    negocioId: "granos",
    costo: 8,
    precio: 13,
    imagen:
      "0017_tarjeta_productos_michipolio_granos_y_cereales_maiz_gatuno.jpg",
    cantidad: 1,
  },
  {
    id: "granos_arroz",
    nombre: "Michi Arroz",
    negocioId: "granos",
    costo: 12,
    precio: 20,
    imagen:
      "0018_tarjeta_productos_michipolio_granos_y_cereales_michi_arroz.jpg",
    cantidad: 1,
  },

  // === FRUTERÍA (6 productos) ===
  {
    id: "fruteria_manzanas_1",
    nombre: "Michi Manzanas",
    negocioId: "fruteria",
    costo: 2,
    precio: 3,
    imagen: "0019_tarjeta_productos_michipolio_fruteria_michi_manzanas.jpg",
    imagen2: "0020_tarjeta_productos_michipolio_fruteria_michi_manzanas_2.jpg",
    cantidad: 2,
  },
  {
    id: "fruteria_sandia_1",
    nombre: "Michi Sandía",
    negocioId: "fruteria",
    costo: 3,
    precio: 5,
    imagen: "0021_tarjeta_productos_michipolio_fruteria_michi_sandia.jpg",
    imagen2: "0022_tarjeta_productos_michipolio_fruteria_michi_sandia_2.jpg",
    cantidad: 2,
  },
  {
    id: "fruteria_pinia",
    nombre: "Piña Gatuna",
    negocioId: "fruteria",
    costo: 4,
    precio: 6,
    imagen: "0023_tarjeta_productos_michipolio_fruteria_pinia_gatuna.jpg",
    cantidad: 1,
  },
  {
    id: "fruteria_mix",
    nombre: "Mix Felino",
    negocioId: "fruteria",
    costo: 5,
    precio: 8,
    imagen: "0024_tarjeta_productos_michipolio_fruteria_mix_felino.jpg",
    cantidad: 1,
  },

  // === PANADERÍA (6 productos) ===
  {
    id: "panaderia_panes_1",
    nombre: "Michi Panes",
    negocioId: "panaderia",
    costo: 3,
    precio: 5,
    imagen: "0025_tarjeta_productos_michipolio_panaderia_michi_panes.jpg",
    imagen2: "0026_tarjeta_productos_michipolio_panaderia_michi_panes_2.jpg",
    cantidad: 2,
  },
  {
    id: "panaderia_pasta_1",
    nombre: "Michi Pasta",
    negocioId: "panaderia",
    costo: 5,
    precio: 8,
    imagen: "0027_tarjeta_productos_michipolio_panaderia_michi_pasta.jpg",
    imagen2: "0028_tarjeta_productos_michipolio_panaderia_michi_pasta_2.jpg",
    cantidad: 2,
  },
  {
    id: "panaderia_empanadas",
    nombre: "Empanadas Gatunas",
    negocioId: "panaderia",
    costo: 6,
    precio: 9,
    imagen: "0029_tarjeta_productos_michipolio_panaderia_empanadas_gatunas.jpg",
    cantidad: 1,
  },
  {
    id: "panaderia_pastel",
    nombre: "Pastel Felino",
    negocioId: "panaderia",
    costo: 10,
    precio: 15,
    imagen: "0030_tarjeta_productos_michipolio_panaderia_pastel_felino.jpg",
    cantidad: 1,
  },

  // === PIZZERÍA (6 productos) ===
  {
    id: "pizzeria_mini_1",
    nombre: "Mini Pizza Gatuna",
    negocioId: "pizzeria",
    costo: 7,
    precio: 10,
    imagen: "0031_tarjeta_productos_michipolio_pizzeria_mini_pizza_gatuna.jpg",
    imagen2:
      "0032_tarjeta_productos_michipolio_pizzeria_mini_pizza_gatuna_2.jpg",
    cantidad: 2,
  },
  {
    id: "pizzeria_calzone_1",
    nombre: "Michi Calzone",
    negocioId: "pizzeria",
    costo: 10,
    precio: 15,
    imagen: "0033_tarjeta_productos_michipolio_pizzeria_michi_calzone.jpg",
    imagen2: "0034_tarjeta_productos_michipolio_pizzeria_michi_calzone_2.jpg",
    cantidad: 2,
  },
  {
    id: "pizzeria_familiar",
    nombre: "Pizza Gatuna Familiar",
    negocioId: "pizzeria",
    costo: 15,
    precio: 22,
    imagen:
      "0035_tarjeta_productos_michipolio_pizzeria_pizza_gatuna_familiar.jpg",
    cantidad: 1,
  },
  {
    id: "pizzeria_combo",
    nombre: "Combo Comelón",
    negocioId: "pizzeria",
    costo: 18,
    precio: 25,
    imagen: "0036_tarjeta_productos_michipolio_pizzeria_combo_comelon.jpg",
    cantidad: 1,
  },

  // === HELADERÍA (6 productos) ===
  {
    id: "heladeria_simple_1",
    nombre: "Michi Cono Simple",
    negocioId: "heladeria",
    costo: 3,
    precio: 5,
    imagen: "0037_tarjeta_productos_michipolio_heladeria_michi_cono_simple.jpg",
    imagen2:
      "0038_tarjeta_productos_michipolio_heladeria_michi_cono_simple_2.jpg",
    cantidad: 2,
  },
  {
    id: "heladeria_doble_1",
    nombre: "Michi Cono Doble",
    negocioId: "heladeria",
    costo: 4,
    precio: 7,
    imagen: "0039_tarjeta_productos_michipolio_heladeria_michi_cono_doble.jpg",
    imagen2:
      "0040_tarjeta_productos_michipolio_heladeria_michi_cono_doble_2.jpg",
    cantidad: 2,
  },
  {
    id: "heladeria_especial",
    nombre: "Helado Spacial",
    negocioId: "heladeria",
    costo: 5,
    precio: 9,
    imagen: "0041_tarjeta_productos_michipolio_heladeria_helado_spacial.jpg",
    cantidad: 1,
  },
  {
    id: "heladeria_banana",
    nombre: "Banana Split Felino",
    negocioId: "heladeria",
    costo: 6,
    precio: 10,
    imagen:
      "0042_tarjeta_productos_michipolio_heladeria_banana_split_felino.jpg",
    cantidad: 1,
  },

  // === COMIDA RÁPIDA (6 productos) ===
  {
    id: "comida_papas_1",
    nombre: "Papas Felinas",
    negocioId: "comida_rapida",
    costo: 5,
    precio: 8,
    imagen: "0043_tarjeta_productos_michipolio_comida_rapida_papas_felinas.jpg",
    imagen2:
      "0044_tarjeta_productos_michipolio_comida_rapida_papas_felinas_2.jpg",
    cantidad: 2,
  },
  {
    id: "comida_hotdog_1",
    nombre: "Hotdog Gatuno",
    negocioId: "comida_rapida",
    costo: 8,
    precio: 12,
    imagen: "0045_tarjeta_productos_michipolio_comida_rapida_hotdog_gatuno.jpg",
    imagen2:
      "0046_tarjeta_productos_michipolio_comida_rapida_hotdog_gatuno_2.jpg",
    cantidad: 2,
  },
  {
    id: "comida_burger",
    nombre: "Michi Burger",
    negocioId: "comida_rapida",
    costo: 10,
    precio: 15,
    imagen: "0047_tarjeta_productos_michipolio_comida_rapida_michi_burger.jpg",
    cantidad: 1,
  },
  {
    id: "comida_combo",
    nombre: "Combo Goloso",
    negocioId: "comida_rapida",
    costo: 14,
    precio: 20,
    imagen: "0048_tarjeta_productos_michipolio_comida_rapida_combo_goloso.jpg",
    cantidad: 1,
  },

  // === CELULARES (6 productos) ===
  {
    id: "celulares_mica_1",
    nombre: "Michi Mica",
    negocioId: "celulares",
    costo: 6,
    precio: 10,
    imagen: "0049_tarjeta_productos_michipolio_celulares_michi_mica.jpg",
    imagen2: "0050_tarjeta_productos_michipolio_celulares_michi_mica_2.jpg",
    cantidad: 2,
  },
  {
    id: "celulares_estuche_1",
    nombre: "Michi Estuche",
    negocioId: "celulares",
    costo: 6,
    precio: 10,
    imagen: "0051_tarjeta_productos_michipolio_celulares_michi_estuche.jpg",
    imagen2: "0052_tarjeta_productos_michipolio_celulares_michi_estuche_2.jpg",
    cantidad: 2,
  },
  {
    id: "celulares_cargador",
    nombre: "Cargador Felino",
    negocioId: "celulares",
    costo: 15,
    precio: 20,
    imagen: "0053_tarjeta_productos_michipolio_celulares_cargador_felino.jpg",
    cantidad: 1,
  },
  {
    id: "celulares_phone",
    nombre: "Michi Phone",
    negocioId: "celulares",
    costo: 80,
    precio: 100,
    imagen: "0054_tarjeta_productos_michipolio_celulares_michi_phone.jpg",
    cantidad: 1,
  },

  // === TECNOLOGÍA (6 productos) ===
  {
    id: "tecnologia_mouse_1",
    nombre: "Michi Mouse",
    negocioId: "tecnologia",
    costo: 10,
    precio: 15,
    imagen: "0055_tarjeta_productos_michipolio_tecnologia_michi_mouse.jpg",
    imagen2: "0056_tarjeta_productos_michipolio_tecnologia_michi_mouse_2.jpg",
    cantidad: 2,
  },
  {
    id: "tecnologia_teclado_1",
    nombre: "Teclado Felino",
    negocioId: "tecnologia",
    costo: 18,
    precio: 25,
    imagen: "0057_tarjeta_productos_michipolio_tecnologia_teclado_felino.jpg",
    imagen2:
      "0058_tarjeta_productos_michipolio_tecnologia_teclado_felino_2.jpg",
    cantidad: 2,
  },
  {
    id: "tecnologia_audifonos",
    nombre: "Michi Audífonos",
    negocioId: "tecnologia",
    costo: 25,
    precio: 30,
    imagen: "0059_tarjeta_productos_michipolio_tecnologia_michi_audifonos.jpg",
    cantidad: 1,
  },
  {
    id: "tecnologia_tablet",
    nombre: "Tablet Gatuna",
    negocioId: "tecnologia",
    costo: 70,
    precio: 90,
    imagen: "0060_tarjeta_productos_michipolio_tecnologia_tablet_gatuna.jpg",
    cantidad: 1,
  },

  // === JUGUETERÍA (6 productos) ===
  {
    id: "jugueteria_pelota_1",
    nombre: "Pelota Felina",
    negocioId: "jugueteria",
    costo: 3,
    precio: 5,
    imagen: "0061_tarjeta_productos_michipolio_jugueteria_pelota_felina.jpg",
    imagen2: "0062_tarjeta_productos_michipolio_jugueteria_pelota_felina_2.jpg",
    cantidad: 2,
  },
  {
    id: "jugueteria_rompecabezas_1",
    nombre: "Michi Rompecabezas",
    negocioId: "jugueteria",
    costo: 10,
    precio: 15,
    imagen:
      "0063_tarjeta_productos_michipolio_jugueteria_michi_rompecabezas.jpg",
    imagen2:
      "0064_tarjeta_productos_michipolio_jugueteria_michi_rompecabezas_2.jpg",
    cantidad: 2,
  },
  {
    id: "jugueteria_pista",
    nombre: "Pista de Autos Gatuna",
    negocioId: "jugueteria",
    costo: 25,
    precio: 35,
    imagen:
      "0065_tarjeta_productos_michipolio_jugueteria_pista_de_autos_gatuna.jpg",
    cantidad: 1,
  },
  {
    id: "jugueteria_robot",
    nombre: "Robot Felino",
    negocioId: "jugueteria",
    costo: 30,
    precio: 45,
    imagen: "0066_tarjeta_productos_michipolio_jugueteria_robot_felino.jpg",
    cantidad: 1,
  },

  // === PAPELERÍA (6 productos) ===
  {
    id: "papeleria_lapicero_1",
    nombre: "Michi Lapicero",
    negocioId: "papeleria",
    costo: 2,
    precio: 3,
    imagen: "0067_tarjeta_productos_michipolio_papeleria_michi_lapicero.jpg",
    imagen2: "0068_tarjeta_productos_michipolio_papeleria_michi_lapicero_2.jpg",
    cantidad: 2,
  },
  {
    id: "papeleria_cuaderno_1",
    nombre: "Cuaderno Felino",
    negocioId: "papeleria",
    costo: 3,
    precio: 5,
    imagen: "0069_tarjeta_productos_michipolio_papeleria_cuaderno_felino.jpg",
    imagen2:
      "0070_tarjeta_productos_michipolio_papeleria_cuaderno_felino_2.jpg",
    cantidad: 2,
  },
  {
    id: "papeleria_marcadores",
    nombre: "Michi Marcadores",
    negocioId: "papeleria",
    costo: 4,
    precio: 6,
    imagen: "0071_tarjeta_productos_michipolio_papeleria_michi_marcadores.jpg",
    cantidad: 1,
  },
  {
    id: "papeleria_mochila",
    nombre: "Mochila Gatuna",
    negocioId: "papeleria",
    costo: 12,
    precio: 18,
    imagen: "0072_tarjeta_productos_michipolio_papeleria_mochila_gatuna.jpg",
    cantidad: 1,
  },

  // === TIENDA DE MASCOTAS (6 productos) ===
  {
    id: "mascotas_collar_1",
    nombre: "Michi Collar",
    negocioId: "mascotas",
    costo: 5,
    precio: 8,
    imagen:
      "0073_tarjeta_productos_michipolio_tienda_de_mascotas_michi_collar.jpg",
    imagen2:
      "0074_tarjeta_productos_michipolio_tienda_de_mascotas_michi_collar_2.jpg",
    cantidad: 2,
  },
  {
    id: "mascotas_juguete_1",
    nombre: "Juguete Gatuno",
    negocioId: "mascotas",
    costo: 7,
    precio: 11,
    imagen:
      "0075_tarjeta_productos_michipolio_tienda_de_mascotas_juguete_gatuno.jpg",
    imagen2:
      "0076_tarjeta_productos_michipolio_tienda_de_mascotas_juguete_gatuno_2.jpg",
    cantidad: 2,
  },
  {
    id: "mascotas_comida",
    nombre: "Comida Felina",
    negocioId: "mascotas",
    costo: 10,
    precio: 15,
    imagen:
      "0077_tarjeta_productos_michipolio_tienda_de_mascotas_comida_felina.jpg",
    cantidad: 1,
  },
  {
    id: "mascotas_cama",
    nombre: "Michi Cama",
    negocioId: "mascotas",
    costo: 15,
    precio: 22,
    imagen:
      "0078_tarjeta_productos_michipolio_tienda_de_mascotas_michi_cama.jpg",
    cantidad: 1,
  },

  // === FERRETERÍA (6 productos) ===
  {
    id: "ferreteria_tornillos_1",
    nombre: "Michi Tornillos",
    negocioId: "ferreteria",
    costo: 2,
    precio: 3,
    imagen: "0079_tarjeta_productos_michipolio_ferreteria_michi_tornillos.jpg",
    imagen2:
      "0080_tarjeta_productos_michipolio_ferreteria_michi_tornillos_2.jpg",
    cantidad: 2,
  },
  {
    id: "ferreteria_brocha_1",
    nombre: "Brocha Felina",
    negocioId: "ferreteria",
    costo: 6,
    precio: 9,
    imagen: "0081_tarjeta_productos_michipolio_ferreteria_brocha_felina.jpg",
    imagen2: "0082_tarjeta_productos_michipolio_ferreteria_brocha_felina_2.jpg",
    cantidad: 2,
  },
  {
    id: "ferreteria_martillo",
    nombre: "Michi Martillo",
    negocioId: "ferreteria",
    costo: 10,
    precio: 15,
    imagen: "0083_tarjeta_productos_michipolio_ferreteria_michi_martillo.jpg",
    cantidad: 1,
  },
  {
    id: "ferreteria_taladro",
    nombre: "Taladro Gatuno",
    negocioId: "ferreteria",
    costo: 30,
    precio: 45,
    imagen: "0084_tarjeta_productos_michipolio_ferreteria_taladro_gatuno.jpg",
    cantidad: 1,
  },

  // === TIENDA DE ROPA (6 productos) ===
  {
    id: "ropa_camiseta_1",
    nombre: "Camiseta Felina",
    negocioId: "ropa",
    costo: 10,
    precio: 15,
    imagen:
      "0085_tarjeta_productos_michipolio_tienda_de_ropa_camiseta_felina.jpg",
    imagen2:
      "0086_tarjeta_productos_michipolio_tienda_de_ropa_camiseta_felina_2.jpg",
    cantidad: 2,
  },
  {
    id: "ropa_pantalon_1",
    nombre: "Michi Pantalón",
    negocioId: "ropa",
    costo: 18,
    precio: 25,
    imagen:
      "0087_tarjeta_productos_michipolio_tienda_de_ropa_michi_pantalon.jpg",
    imagen2:
      "0088_tarjeta_productos_michipolio_tienda_de_ropa_michi_pantalon_2.jpg",
    cantidad: 2,
  },
  {
    id: "ropa_chaqueta",
    nombre: "Chaqueta Gatuna",
    negocioId: "ropa",
    costo: 25,
    precio: 35,
    imagen:
      "0089_tarjeta_productos_michipolio_tienda_de_ropa_chaqueta_gatuna.jpg",
    cantidad: 1,
  },
  {
    id: "ropa_zapatillas",
    nombre: "Michi Zapatillas",
    negocioId: "ropa",
    costo: 30,
    precio: 45,
    imagen:
      "0090_tarjeta_productos_michipolio_tienda_de_ropa_michi_zapatillas.jpg",
    cantidad: 1,
  },

  // === FARMACIA (6 productos) ===
  {
    id: "farmacia_pastillas_1",
    nombre: "Michi Pastillas",
    negocioId: "farmacia",
    costo: 5,
    precio: 8,
    imagen: "0091_tarjeta_productos_michipolio_farmacia_michi_pastillas.jpg",
    imagen2: "0092_tarjeta_productos_michipolio_farmacia_michi_pastillas_2.jpg",
    cantidad: 2,
  },
  {
    id: "farmacia_jarabe_1",
    nombre: "Jarabe Felino",
    negocioId: "farmacia",
    costo: 7,
    precio: 11,
    imagen: "0093_tarjeta_productos_michipolio_farmacia_jarabe_felino.jpg",
    imagen2: "0094_tarjeta_productos_michipolio_farmacia_jarabe_felino_2.jpg",
    cantidad: 2,
  },
  {
    id: "farmacia_vitaminas",
    nombre: "Vitaminas Gatunas",
    negocioId: "farmacia",
    costo: 10,
    precio: 16,
    imagen: "0095_tarjeta_productos_michipolio_farmacia_vitaminas_gatunas.jpg",
    cantidad: 1,
  },
  {
    id: "farmacia_crema",
    nombre: "Michi Crema",
    negocioId: "farmacia",
    costo: 12,
    precio: 20,
    imagen: "0096_tarjeta_productos_michipolio_farmacia_michi_crema.jpg",
    cantidad: 1,
  },
];

// Función helper para obtener productos de un negocio
export const getProductosPorNegocio = (negocioId: string): Producto[] => {
  return PRODUCTOS.filter((p) => p.negocioId === negocioId);
};

// ====== JUGADORES ======
export interface Jugador {
  id: number;
  nombre: string;
  emoji: string;
  posicion: number;
  dinero: number;
}

// ====== ESTADO DEL JUEGO ======
export interface EstadoJuego {
  jugadores: Jugador[];
  turnoActual: number;
  dados: [number, number];
  fase: "inicio" | "tirando-dados" | "moviendo" | "accion" | "fin-turno";
}

// ====== TABLERO ======
export const TABLERO: Casilla[] = [
  // === ESQUINA INFERIOR IZQUIERDA (RECARGAR) - Posición 0 ===
  {
    id: 0,
    nombre: "Recargar",
    tipo: "esquina-recargar",
    emoji: "🔄",
    lado: "corner",
    posicion: 0,
  },

  // === LADO IZQUIERDO (de abajo hacia arriba) - Posiciones 1-5 ===
  {
    id: 1,
    nombre: "Marisquería",
    tipo: "tienda",
    categoria: "azul-marino",
    emoji: "🦐",
    lado: "left",
    posicion: 1,
    negocioId: "marisqueria",
  },
  {
    id: 2,
    nombre: "Carnicería",
    tipo: "tienda",
    categoria: "rojo",
    emoji: "🥩",
    lado: "left",
    posicion: 2,
    negocioId: "carniceria",
  },
  {
    id: 3,
    nombre: "Evento Michi",
    tipo: "evento",
    categoria: "especial",
    emoji: "🐱❓",
    lado: "left",
    posicion: 3,
  },
  {
    id: 4,
    nombre: "Granos y Cereales",
    tipo: "tienda",
    categoria: "verde",
    emoji: "🌾",
    lado: "left",
    posicion: 4,
    negocioId: "granos",
  },
  {
    id: 5,
    nombre: "Frutería",
    tipo: "tienda",
    categoria: "naranja",
    emoji: "🥕",
    lado: "left",
    posicion: 5,
    negocioId: "fruteria",
  },

  // === ESQUINA SUPERIOR IZQUIERDA (INVERTIR) - Posición 6 ===
  {
    id: 6,
    nombre: "Invertir",
    tipo: "esquina-invertir",
    emoji: "💰",
    lado: "corner",
    posicion: 6,
  },

  // === LADO SUPERIOR (de izquierda a derecha) - Posiciones 7-11 ===
  {
    id: 7,
    nombre: "Panadería",
    tipo: "tienda",
    categoria: "amarillo",
    emoji: "🥖",
    lado: "top",
    posicion: 1,
    negocioId: "panaderia",
  },
  {
    id: 8,
    nombre: "Pizzería",
    tipo: "tienda",
    categoria: "amarillo",
    emoji: "🍕",
    lado: "top",
    posicion: 2,
    negocioId: "pizzeria",
  },
  {
    id: 9,
    nombre: "Evento Michi",
    tipo: "evento",
    categoria: "especial",
    emoji: "🐱🍦",
    lado: "top",
    posicion: 3,
  },
  {
    id: 10,
    nombre: "Heladería",
    tipo: "tienda",
    categoria: "celeste",
    emoji: "🍦",
    lado: "top",
    posicion: 4,
    negocioId: "heladeria",
  },
  {
    id: 11,
    nombre: "Comida Rápida",
    tipo: "tienda",
    categoria: "amarillo",
    emoji: "🍔",
    lado: "top",
    posicion: 5,
    negocioId: "comida_rapida",
  },

  // === ESQUINA SUPERIOR DERECHA (INVERTIR) - Posición 12 ===
  {
    id: 12,
    nombre: "Invertir",
    tipo: "esquina-invertir",
    emoji: "💰",
    lado: "corner",
    posicion: 12,
  },

  // === LADO DERECHO (de arriba hacia abajo) - Posiciones 13-17 ===
  {
    id: 13,
    nombre: "Celulares",
    tipo: "tienda",
    categoria: "azul",
    emoji: "📱",
    lado: "right",
    posicion: 1,
    negocioId: "celulares",
  },
  {
    id: 14,
    nombre: "Tecnología",
    tipo: "tienda",
    categoria: "azul",
    emoji: "💻",
    lado: "right",
    posicion: 2,
    negocioId: "tecnologia",
  },
  {
    id: 15,
    nombre: "Evento Michi",
    tipo: "evento",
    categoria: "especial",
    emoji: "🐱💬",
    lado: "right",
    posicion: 3,
  },
  {
    id: 16,
    nombre: "Juguetería",
    tipo: "tienda",
    categoria: "verde-claro",
    emoji: "🧸",
    lado: "right",
    posicion: 4,
    negocioId: "jugueteria",
  },
  {
    id: 17,
    nombre: "Papelería",
    tipo: "tienda",
    categoria: "rosa",
    emoji: "✏️",
    lado: "right",
    posicion: 5,
    negocioId: "papeleria",
  },

  // === ESQUINA INFERIOR DERECHA (INVERTIR) - Posición 18 ===
  {
    id: 18,
    nombre: "Invertir",
    tipo: "esquina-invertir",
    emoji: "💰",
    lado: "corner",
    posicion: 18,
  },

  // === LADO INFERIOR (de derecha a izquierda) - Posiciones 19-23 ===
  {
    id: 19,
    nombre: "Tienda de Mascotas",
    tipo: "tienda",
    categoria: "celeste",
    emoji: "🐕",
    lado: "bottom",
    posicion: 1,
    negocioId: "mascotas",
  },
  {
    id: 20,
    nombre: "Ferretería",
    tipo: "tienda",
    categoria: "morado",
    emoji: "🔧",
    lado: "bottom",
    posicion: 2,
    negocioId: "ferreteria",
  },
  {
    id: 21,
    nombre: "Evento Michi",
    tipo: "evento",
    categoria: "especial",
    emoji: "🐱❓",
    lado: "bottom",
    posicion: 3,
  },
  {
    id: 22,
    nombre: "Tienda de Ropa",
    tipo: "tienda",
    categoria: "rosa",
    emoji: "👕",
    lado: "bottom",
    posicion: 4,
    negocioId: "ropa",
  },
  {
    id: 23,
    nombre: "Farmacia",
    tipo: "tienda",
    categoria: "rosa",
    emoji: "💊",
    lado: "bottom",
    posicion: 5,
    negocioId: "farmacia",
  },
];

// Total: 24 casillas (4 esquinas + 5 casillas x 4 lados = 4 + 20 = 24)
// Negocios: 16 tiendas comprables
