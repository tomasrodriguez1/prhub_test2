# PR Hub

Panel de administración para gestión de marcas e influencers. Aplicación SPA construida con Vite + React + TypeScript, utilizando datos mock almacenados en localStorage.

## Características

- **Dashboard con KPIs**: Métricas en tiempo real (facturado, pendientes, LTV, DSO, margen, etc.)
- **Gestión de Marcas**: Lista, detalle con timeline de historial y KPIs por marca
- **Proyectos con Kanban**: Gestión de tareas con drag & drop usando dnd-kit
- **Influencers**: Directorio con métricas y historial de rendimiento
- **Facturación**: Gestión de facturas y registro de pagos
- **PWA**: Aplicación web progresiva con soporte offline básico
- **Tema Claro/Oscuro**: Persistente en localStorage
- **Atajos de Teclado**: Navegación rápida y command palette

## Stack Tecnológico

- **Frontend**: Vite 5 + React 18 + TypeScript
- **Routing**: React Router v6
- **Estado**: Zustand con persistencia en localStorage
- **UI**: TailwindCSS + componentes estilo shadcn
- **Gráficos**: Recharts
- **Drag & Drop**: dnd-kit
- **PWA**: vite-plugin-pwa

## Instalación

```bash
# Instalar dependencias
npm install
# o
pnpm install
# o
yarn install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

```bash
# Construir para producción
npm run build
# o
pnpm build
```

Los archivos generados estarán en la carpeta `dist/`.

## Preview de Producción

```bash
# Previsualizar build de producción
npm run preview
# o
pnpm preview
```

## Deploy en Render

Este proyecto está configurado para deploy automático en Render:

1. **Conecta tu repositorio de GitHub a Render**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Crea un nuevo "Web Service"
   - Conecta tu repositorio de GitHub

2. **Configuración automática**
   - Render detectará automáticamente el archivo `render.yaml`
   - El build se ejecutará con: `npm install && npm run build`
   - El servicio iniciará con: `npm run preview`

3. **Variables de entorno** (opcional)
   - No se requieren variables de entorno para esta aplicación frontend-only

4. **Notas**
   - El puerto se configura automáticamente (Render usa la variable `PORT`)
   - Asegúrate de que el branch principal esté actualizado en GitHub

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── ui/          # Componentes UI base (Button, Card, etc.)
│   └── KanbanBoard.tsx
├── data/            # Datos mock/seed
│   └── seed.ts
├── layouts/         # Layouts de la aplicación
│   └── AppLayout.tsx
├── pages/           # Páginas principales
│   ├── DashboardPage.tsx
│   ├── BrandsPage.tsx
│   ├── BrandDetailPage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── InfluencersPage.tsx
│   ├── InfluencerDetailPage.tsx
│   └── InvoicesPage.tsx
├── store/           # Store Zustand
│   └── useStore.ts
├── types/           # Tipos TypeScript
│   └── index.ts
├── lib/             # Utilidades
│   └── utils.ts
├── App.tsx          # Componente raíz
├── main.tsx         # Entry point
└── index.css        # Estilos globales
```

## Atajos de Teclado

- `Cmd/Ctrl + K`: Abrir command palette
- `g + d`: Ir a Dashboard
- `g + b`: Ir a Marcas
- `g + p`: Ir a Proyectos
- `g + i`: Ir a Influencers
- `g + f`: Ir a Facturación
- `n`: Crear nuevo item (en páginas que lo soporten)

## Datos Mock

La aplicación viene con datos de ejemplo pre-cargados:
- 6 marcas
- 15 influencers
- 8 proyectos
- 30 tareas
- 14 facturas
- 9 pagos
- Historiales de marcas e influencers

Todos los datos se persisten en `localStorage` bajo la clave `pr-hub-storage`.

## PWA

La aplicación está configurada como PWA (Progressive Web App) con:
- Manifest configurado
- Service Worker para cache básico
- Soporte para instalación en dispositivos

## Tema

El tema (claro/oscuro) se puede cambiar desde el menú lateral (desktop) o header (mobile) y se persiste en localStorage.

## Notas

- Esta es una aplicación frontend-only con datos mock
- No requiere backend ni base de datos
- Todos los datos se almacenan en localStorage del navegador
- Los cambios se persisten automáticamente

## Licencia

MIT

