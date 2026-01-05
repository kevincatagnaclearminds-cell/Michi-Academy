# 🎓 Michi Academy - Plataforma Educativa de Educación Financiera

Plataforma educativa completa para la enseñanza de educación financiera, diseñada para estudiantes de nivel primaria y secundaria. El proyecto consta de un backend API REST y dos aplicaciones frontend independientes.

---

## 📋 Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Levantamiento del Proyecto](#levantamiento-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [URLs de Acceso](#urls-de-acceso)
- [Comandos Útiles](#comandos-útiles)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura de **3 aplicaciones separadas**:

```
Michi-Academy/
├── Backend/              # API REST (Node.js + Express + TypeScript)
├── Primaria/             # Frontend para nivel Primaria (React + Vite)
│   └── frontend-primaria/
└── Secundaria/           # Frontend para nivel Secundaria (React + Vite)
    └── frontend-secundaria/
```

### Flujo de Comunicación

```
Frontend Primaria (3000) ──┐
                           ├──> Backend API (4000) ──> PostgreSQL (5432)
Frontend Secundaria (3001) ─┘
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | - | Runtime de JavaScript |
| **TypeScript** | 5.0+ | Lenguaje con tipado estático |
| **Express.js** | 4.18+ | Framework web para APIs REST |
| **PostgreSQL** | 15 | Base de datos relacional |
| **Prisma** | 5.0+ | ORM type-safe para PostgreSQL |
| **JWT** (jsonwebtoken) | 9.0+ | Autenticación con tokens |
| **bcryptjs** | 2.4+ | Hash de contraseñas |
| **Helmet** | 7.0+ | Seguridad HTTP headers |
| **CORS** | 2.8+ | Cross-Origin Resource Sharing |
| **Nodemailer** | 7.0+ | Envío de emails |
| **Docker** | - | Contenedorización de PostgreSQL |

### Frontend (Primaria y Secundaria)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.0+ | Biblioteca para interfaces de usuario |
| **TypeScript** | 5.0+ | Lenguaje con tipado estático |
| **Vite** | 5.0+ | Build tool y dev server |
| **React Router DOM** | 7.11+ | Navegación SPA |
| **Formik** | 2.4+ | Manejo de formularios |
| **Yup** | 1.3+ | Validación de esquemas |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior) - Viene con Node.js
- **Docker** y **Docker Compose** - [Descargar](https://www.docker.com/)
- **Git** - [Descargar](https://git-scm.com/)

### Verificar Instalación

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar v9.x.x o superior
docker --version  # Debe mostrar Docker version x.x.x
docker-compose --version  # Debe mostrar docker-compose version x.x.x
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Michi-Academy
```

### 2. Instalar Dependencias del Backend

```bash
cd Backend
npm install
```

### 3. Instalar Dependencias del Frontend Primaria

```bash
cd ../Primaria/frontend-primaria
npm install
```

### 4. Instalar Dependencias del Frontend Secundaria

```bash
cd ../../Secundaria/frontend-secundaria
npm install
```

---

## ⚙️ Configuración

### Backend

1. **Crear archivo `.env` en la carpeta `Backend/`:**

```bash
cd Backend
touch .env
```

2. **Agregar las siguientes variables de entorno:**

```env
# Puerto del servidor
PORT=4000

# Entorno
NODE_ENV=development

# Base de datos PostgreSQL
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/login_MichiAcademy

# JWT
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# CORS (permitir ambos frontends)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Email (opcional, para recuperación de contraseña)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
```

3. **Configurar Prisma y ejecutar migraciones:**

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

### Frontend Primaria

1. **Crear archivo `.env` en `Primaria/frontend-primaria/` (opcional):**

```env
VITE_API_BASE_URL=http://localhost:4000
```

> **Nota:** Si no creas el archivo `.env`, usará el valor por defecto `http://localhost:4000`.

### Frontend Secundaria

1. **Crear archivo `.env` en `Secundaria/frontend-secundaria/` (opcional):**

```env
VITE_API_BASE_URL=http://localhost:4000
```

> **Nota:** Si no creas el archivo `.env`, usará el valor por defecto `http://localhost:4000`.

---

## 🚀 Levantamiento del Proyecto

### Opción 1: Levantamiento Manual (Recomendado para Desarrollo)

#### Paso 1: Levantar PostgreSQL con Docker

```bash
cd Backend
docker-compose up -d
```

Verificar que el contenedor esté corriendo:
```bash
docker ps
```

Deberías ver un contenedor llamado `postgres_db` en ejecución.

#### Paso 2: Levantar el Backend

Abre una **nueva terminal**:

```bash
cd Backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:4000
📝 Entorno: development
🔗 CORS habilitado para: http://localhost:3000,http://localhost:3001
```

#### Paso 3: Levantar Frontend Primaria

Abre una **nueva terminal**:

```bash
cd Primaria/frontend-primaria
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

#### Paso 4: Levantar Frontend Secundaria

Abre una **nueva terminal**:

```bash
cd Secundaria/frontend-secundaria
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
```

### Opción 2: Scripts de Inicio Rápido (Futuro)

> **Nota:** Puedes crear scripts personalizados para automatizar el levantamiento de todos los servicios.

---

## 📁 Estructura del Proyecto

```
Michi-Academy/
│
├── Backend/
│   ├── src/
│   │   ├── app/              # Configuración de Express
│   │   │   ├── middlewares/  # Error handling, logging
│   │   │   ├── routes.ts     # Router principal
│   │   │   └── server.ts     # Entry point
│   │   ├── config/           # Configuración (env, prisma)
│   │   ├── modules/          # Módulos de negocio
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── cart/         # Carrito de compras
│   │   │   ├── games/        # Videojuegos educativos
│   │   │   ├── orders/       # Órdenes
│   │   │   ├── reviews/      # Reseñas
│   │   │   └── users/         # Gestión de usuarios
│   │   └── shared/           # Código compartido
│   │       ├── errors/       # Manejo de errores
│   │       ├── guards/       # Middlewares de auth
│   │       ├── utils/        # Utilidades
│   │       └── validators/   # Validación
│   ├── prisma/
│   │   ├── schema.prisma     # Schema de la base de datos
│   │   └── migrations/       # Migraciones
│   ├── docker-compose.yml    # Configuración de PostgreSQL
│   ├── package.json
│   └── tsconfig.json
│
├── Primaria/
│   └── frontend-primaria/
│       ├── src/
│       │   ├── modules/      # Módulos por feature
│       │   │   ├── auth/     # Login, registro
│       │   │   ├── activities/
│       │   │   ├── games/    # Juegos educativos
│       │   │   └── ...
│       │   └── shared/       # Código compartido
│       │       ├── components/
│       │       ├── services/ # API services
│       │       ├── hooks/    # Custom hooks
│       │       └── types/    # TypeScript types
│       ├── package.json
│       └── vite.config.ts
│
└── Secundaria/
    └── frontend-secundaria/
        ├── src/
        │   ├── modules/      # Módulos por feature
        │   └── shared/       # Código compartido
        ├── package.json
        └── vite.config.ts
```

---

## 🌐 URLs de Acceso

Una vez levantados todos los servicios:

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Backend API** | http://localhost:4000 | 4000 |
| **Frontend Primaria** | http://localhost:3000 | 3000 |
| **Frontend Secundaria** | http://localhost:3001 | 3001 |
| **PostgreSQL** | localhost:5432 | 5432 (solo interno) |

### Rutas Principales

#### Frontend Primaria
- Login: `http://localhost:3000/primaria/login`
- Activities: `http://localhost:3000/primaria/activities`

#### Frontend Secundaria
- Login: `http://localhost:3001/secundaria/login`
- Activities: `http://localhost:3001/secundaria/activities`

#### Backend API
- Health Check: `http://localhost:4000/health`
- Login Primaria: `POST http://localhost:4000/api/auth/login/primaria`
- Login Secundaria: `POST http://localhost:4000/api/auth/login/secundaria`

---

## 🛠️ Comandos Útiles

### Backend

```bash
cd Backend

# Desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start

# Prisma
npx prisma generate          # Generar cliente Prisma
npx prisma migrate dev        # Ejecutar migraciones
npx prisma studio            # Abrir Prisma Studio (GUI de BD)
npx prisma db push           # Sincronizar schema sin migraciones

# Docker
docker-compose up -d         # Levantar PostgreSQL
docker-compose down          # Detener PostgreSQL
docker-compose logs          # Ver logs de PostgreSQL
```

### Frontend (Primaria y Secundaria)

```bash
cd Primaria/frontend-primaria  # o Secundaria/frontend-secundaria

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🔧 Troubleshooting

### Problema: Puerto ya en uso

**Error:** `EADDRINUSE: address already in use :::4000`

**Solución:**
```bash
# Encontrar el proceso que usa el puerto
sudo lsof -i :4000

# Matar el proceso (reemplaza PID con el número real)
kill -9 <PID>
```

### Problema: PostgreSQL no inicia

**Error:** `Error starting userland proxy`

**Solución:**
```bash
# Verificar que el puerto 5432 esté libre
sudo lsof -i :5432

# Si está ocupado, detener el proceso o cambiar el puerto en docker-compose.yml
```

### Problema: CORS bloqueando peticiones

**Error:** `Access to fetch at 'http://localhost:4000' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Solución:**
- Verificar que en `Backend/src/config/env.ts` o `.env` esté configurado:
  ```env
  CORS_ORIGIN=http://localhost:3000,http://localhost:3001
  ```
- Reiniciar el backend después de cambiar la configuración

### Problema: Prisma no encuentra la base de datos

**Error:** `Can't reach database server`

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# Si no está corriendo:
cd Backend
docker-compose up -d

# Verificar la URL en .env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/login_MichiAcademy
```

### Problema: Módulos no encontrados

**Error:** `Cannot find module 'xxx'`

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Notas Importantes

### Seguridad

- ⚠️ **NUNCA** commitees archivos `.env` al repositorio
- ⚠️ Cambia `JWT_SECRET` en producción
- ⚠️ Cambia las credenciales de PostgreSQL en producción
- ⚠️ Usa variables de entorno para todos los secrets

### Desarrollo

- El backend usa **hot-reload** con `ts-node-dev`
- Los frontends usan **HMR** (Hot Module Replacement) con Vite
- Los cambios en el código se reflejan automáticamente sin reiniciar

### Base de Datos

- PostgreSQL se ejecuta en un contenedor Docker
- Los datos persisten en un volumen de Docker
- Para resetear la BD: `docker-compose down -v` (⚠️ elimina todos los datos)

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso educativo.

---

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Última actualización:** 2025-01-27

