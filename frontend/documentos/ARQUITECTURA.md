# 🏗️ Arquitectura del Proyecto - Michi Academy Frontend

## 📋 Visión General

El proyecto sigue una **arquitectura modular** que separa las funcionalidades por dominio, facilitando el mantenimiento y la escalabilidad.

---

## 📁 Estructura de Directorios

```
frontend/
├── src/
│   ├── app/                    # Configuración de la aplicación
│   │   ├── App.tsx            # Componente raíz
│   │   └── routes.tsx         # Configuración de rutas
│   │
│   ├── modules/                # Módulos de funcionalidad
│   │   ├── auth/              # Módulo de autenticación
│   │   │   ├── components/    # Componentes específicos del módulo
│   │   │   ├── hooks/         # Hooks personalizados
│   │   │   ├── pages/         # Páginas del módulo
│   │   │   └── styles/        # Estilos del módulo
│   │   │
│   │   ├── cart/              # Módulo de carrito
│   │   ├── games/             # Módulo de juegos
│   │   ├── orders/            # Módulo de pedidos
│   │   ├── profile/           # Módulo de perfil
│   │   └── reviews/           # Módulo de reseñas
│   │
│   ├── shared/                 # Código compartido entre módulos
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── layout/        # Componentes de diseño (Navbar, Footer)
│   │   │   └── ui/            # Componentes de UI (Button, Input, Card)
│   │   │
│   │   ├── hooks/             # Hooks compartidos
│   │   ├── services/          # Servicios API
│   │   ├── store/             # Estado global (stores)
│   │   ├── types/             # Tipos TypeScript compartidos
│   │   └── utils/             # Utilidades
│   │
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
│
├── public/                     # Archivos estáticos
│   └── images/                # Imágenes públicas
│
├── documentos/                 # Documentación del proyecto
│
├── index.html                 # HTML principal
├── package.json               # Dependencias
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # Configuración de TypeScript
└── tsconfig.node.json         # Configuración de TypeScript para Node
```

---

## 🎯 Principios de Arquitectura

### 1. **Separación por Módulos**
Cada módulo (`auth`, `cart`, `games`, etc.) agrupa toda la funcionalidad relacionada:
- Componentes específicos
- Hooks personalizados
- Páginas
- Estilos

### 2. **Código Compartido en `shared/`**
Todo lo que se usa en múltiples módulos va en `shared/`:
- Componentes UI reutilizables
- Hooks comunes
- Servicios de API
- Tipos compartidos
- Utilidades

### 3. **Convenciones de Nomenclatura**
- **Componentes**: PascalCase (`LoginPage.tsx`, `AuthForm.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`, `useCart.ts`)
- **Servicios**: camelCase con sufijo `.service.ts` (`auth.service.ts`)
- **Tipos**: camelCase con sufijo `.types.ts` (`auth.types.ts`)
- **Utilidades**: camelCase (`formatDate.ts`, `formatPrice.ts`)

---

## 📦 Estructura de un Módulo Completo

### Ejemplo: Módulo de Autenticación (`auth/`)

```
auth/
├── components/
│   └── AuthForm.tsx          # Formulario de autenticación
│
├── hooks/
│   └── useAuth.ts            # Hook para lógica de autenticación
│
├── pages/
│   ├── LoginPage.tsx         # Página de login
│   └── RegisterPage.tsx      # Página de registro
│
└── styles/
    └── login-styles.css      # Estilos específicos del login
```

**Responsabilidades**:
- `components/`: Componentes específicos del módulo que no se reutilizan en otros lugares
- `hooks/`: Lógica de negocio específica del módulo
- `pages/`: Páginas/vistas del módulo
- `styles/`: Estilos CSS específicos del módulo

---

## 🔄 Flujo de Datos

### 1. **Páginas** → **Componentes**
Las páginas orquestan los componentes y manejan el layout general.

### 2. **Componentes** → **Hooks**
Los componentes usan hooks para acceder a la lógica de negocio.

### 3. **Hooks** → **Servicios**
Los hooks llaman a servicios para comunicarse con el backend.

### 4. **Servicios** → **API Client**
Los servicios usan un cliente HTTP centralizado (`apiClient.ts`).

### 5. **Store** → **Estado Global**
El estado global se maneja a través de stores (Zustand o Context API).

```
┌─────────┐
│  Pages  │
└────┬────┘
     │
     ▼
┌─────────┐
│Components│
└────┬────┘
     │
     ▼
┌─────────┐
│  Hooks  │
└────┬────┘
     │
     ▼
┌─────────┐     ┌─────────┐
│Services │────▶│API Client│
└────┬────┘     └─────────┘
     │
     ▼
┌─────────┐
│  Store  │
└─────────┘
```

---

## 🎨 Capa de Presentación

### Componentes UI (`shared/components/ui/`)
Componentes básicos reutilizables:
- `Button.tsx` - Botones
- `Input.tsx` - Campos de entrada
- `Card.tsx` - Tarjetas

### Componentes de Layout (`shared/components/layout/`)
Componentes estructurales:
- `Navbar.tsx` - Barra de navegación
- `Footer.tsx` - Pie de página

### Componentes de Módulo (`modules/[module]/components/`)
Componentes específicos de un módulo:
- `AuthForm.tsx` - Formulario de autenticación
- `GameCard.tsx` - Tarjeta de juego

---

## 🔌 Capa de Servicios

### Servicios API (`shared/services/`)
Cada servicio maneja las llamadas a endpoints específicos:

```typescript
// auth.service.ts
export const authService = {
  login(credentials) { ... },
  logout() { ... },
  refresh() { ... }
}

// games.service.ts
export const gamesService = {
  getAll() { ... },
  getById(id) { ... },
  search(query) { ... }
}
```

### API Client (`shared/services/apiClient.ts`)
Cliente HTTP centralizado que:
- Configura headers comunes
- Maneja tokens de autenticación
- Maneja errores globalmente

---

## 📊 Gestión de Estado

### Estado Local
- **useState**: Estado de componentes individuales
- **useReducer**: Estado más complejo en componentes

### Estado Global
- **Store** (`shared/store/`): Estado compartido entre componentes
- **Context API o Zustand**: Librería para manejo de estado

### Ejemplo: Auth Store
```typescript
// auth.store.ts
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

---

## 🎣 Custom Hooks

### Hooks de Módulo (`modules/[module]/hooks/`)
Encapsulan lógica específica del módulo:

```typescript
// useAuth.ts
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const login = async (credentials) => { ... };
  return { login, isLoading };
};
```

### Hooks Compartidos (`shared/hooks/`)
Hooks reutilizables en múltiples módulos:
- `useFetch.ts` - Para llamadas API
- `usePagination.ts` - Para paginación

---

## 📝 Tipos TypeScript

### Tipos de Módulo (`shared/types/`)
Cada módulo define sus tipos:

```typescript
// auth.types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

// game.types.ts
export interface Game {
  id: string;
  title: string;
  price: number;
}
```

---

## 🔀 Enrutamiento

### Configuración (`src/app/routes.tsx`)
React Router maneja todas las rutas:

```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/games" element={<GamesListPage />} />
  <Route path="/games/:id" element={<GameDetailPage />} />
</Routes>
```

### Rutas por Módulo
Cada módulo tiene sus propias páginas que se registran en `routes.tsx`.

---

## 🎨 Estilos

### Estrategia de Estilos

1. **Estilos Globales** (`src/index.css`)
   - Reset CSS
   - Variables CSS globales
   - Estilos base

2. **Estilos de Módulo** (`modules/[module]/styles/`)
   - Estilos específicos del módulo
   - No afectan otros módulos

3. **CSS Modules o Styled Components** (futuro)
   - Para evitar conflictos de nombres

---

## 🚀 Configuración del Proyecto

### Vite (`vite.config.ts`)
- Build tool y dev server
- Hot Module Replacement (HMR)
- Optimización de dependencias

### TypeScript (`tsconfig.json`)
- Configuración de compilación
- Path aliases (`@/*` → `src/*`)
- Estricto mode habilitado

### Package.json
- Scripts: `dev`, `build`, `preview`
- Dependencias de producción
- DevDependencies

---

## 📋 Guía para Agregar Nuevos Módulos

1. **Crear estructura de carpetas**:
   ```
   modules/nuevo-modulo/
   ├── components/
   ├── hooks/
   ├── pages/
   └── styles/
   ```

2. **Crear tipos** en `shared/types/nuevo-modulo.types.ts`

3. **Crear servicio** en `shared/services/nuevo-modulo.service.ts`

4. **Crear hook** en `modules/nuevo-modulo/hooks/useNuevoModulo.ts`

5. **Crear páginas** en `modules/nuevo-modulo/pages/`

6. **Registrar rutas** en `src/app/routes.tsx`

---

## ✅ Ventajas de esta Arquitectura

1. **Modularidad**: Fácil de mantener y escalar
2. **Reutilización**: Componentes y hooks compartidos
3. **Separación de Concerns**: Lógica separada de presentación
4. **Testeable**: Cada módulo puede testearse independientemente
5. **Type-Safe**: TypeScript en toda la aplicación
6. **Escalable**: Fácil agregar nuevos módulos

---

## 📚 Referencias

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev)
- [React Router](https://reactrouter.com)

