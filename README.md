# ZonaMatch React

Frontend de ZonaMatch construido con React, TypeScript y Vite.

## Estructura

```text
src/
├── app/          # composición de la aplicación, providers y router
├── core/         # API, autenticación, hooks, tipos y utilidades globales
├── shared/       # componentes, layouts, UI y constantes reutilizables
├── features/     # módulos organizados por dominio
├── assets/       # recursos estáticos importados por la aplicación
└── styles/       # estilos globales y configuración Tailwind
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

La URL de API puede configurarse mediante `VITE_API_URL`.
