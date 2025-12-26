# Assets de MichiLandia

## Estructura de carpetas

```
assets/
├── negocios/     # Imágenes de los negocios/tiendas del tablero
├── fichas/       # Fichas de jugadores y cliente
├── cartas/       # Cartas del juego (eventos, suerte, etc.)
├── productos/    # Productos que se venden en los negocios
├── tablero/      # Elementos del tablero
└── ui/           # Elementos de interfaz (botones, iconos, marcos)
```

## Cómo importar assets

```tsx
// Importar imagen desde assets
import miNegocio from './assets/negocios/panaderia.png';

// Usar en componente
<img src={miNegocio} alt="Panadería" />
```

## Negocios del tablero

| Casilla | Negocio | Categoría |
|---------|---------|-----------|
| 7 | Panadería | Comida |
| 8 | Pizzería | Comida |
| 10 | Heladería | Comida |
| 11 | Comida Rápida | Comida |
| 13 | Celulares | Tecnología |
| 14 | Tecnología | Tecnología |
| 16 | Juguetería | Entretenimiento |
| 17 | Papelería | Útiles |
| 19 | Tienda de Mascotas | Mascotas |
| 20 | Ferretería | Herramientas |
| 22 | Tienda de Ropa | Ropa |
| 23 | Farmacia | Salud |
| 1 | Marisquería | Comida |
| 2 | Carnicería | Comida |
| 4 | Granos y Cereales | Comida |
| 5 | Frutiverdura | Comida |



