# ZonaMatch React

Frontend de ZonaMatch construido con React, TypeScript y Vite.

## Stack tecnológico

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- PrimeReact 10
- PrimeIcons 8
- React Router 7
- React Query 5
- React Hook Form 7
- Zod 4
- Axios
- Leaflet

## Requisitos

Se recomienda utilizar versiones modernas de Node.js compatibles con Vite 8.

Versiones utilizadas durante el desarrollo:

- Node.js 24.21.0
- npm 11.x

También debería funcionar con:

- Node.js 22 LTS o superior
- npm 10 o superior

Para verificar las versiones instaladas:

```bash
node -v
npm -v
```

## Ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/sergabrubio/ZonaMatchSPA.git

cd ZonaMatchSPA
```

### 2. Instalar dependencias

Desde la raíz del proyecto ejecute:

```bash
npm ci
```

> `npm ci` requiere que exista el archivo `package-lock.json`.
> Si por algún motivo no estuviera disponible, utilice:

```bash
npm install
```

### 3. Configurar variables de entorno

Cree un archivo `.env.local` en la raíz del proyecto.

Ejemplo:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

Reemplace el puerto según la configuración del backend.

> Importante:
>
> - La URL debe ser accesible desde el navegador.
> - No utilice nombres internos de contenedores Docker.
> - El archivo `.env.local` no debe versionarse y se encuentra excluido mediante `.gitignore`.

### 4. Ejecutar la aplicación

```bash
npm run dev
```

Vite mostrará una URL similar a:

```text
http://localhost:5173
```

Abra dicha URL en el navegador.

## Integración con Backend

El backend debe:

- Publicar su puerto en el host.
- Permitir solicitudes CORS desde el frontend.
- Exponer la API en la URL configurada mediante `VITE_API_URL`.

Por ejemplo:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080/api
```

Actualmente la configuración de Vite no incluye un proxy para `/api`.

Si `VITE_API_URL` no está definido, el cliente Axios utilizará:

```text
/api
```

sobre el mismo origen donde se ejecuta el frontend.

## Comandos disponibles

```bash
npm run dev         # inicia Vite en modo desarrollo

npm run build       # ejecuta validación TypeScript y genera la compilación

```

## Estructura del proyecto

```text
src/
├── app/            # composición de la aplicación, providers y router
├── core/           # API, autenticación, hooks, tipos y utilidades globales
├── shared/         # componentes, layouts, UI y constantes reutilizables
├── features/       # módulos organizados por dominio
├── assets/         # recursos estáticos importados por la aplicación
└── styles/         # estilos globales y configuración de Tailwind
```

## Tecnologías de UI

La aplicación utiliza:

- Tailwind CSS 4 para layout, espaciado y estilos utilitarios.
- PrimeReact 10 para componentes de interfaz.
- PrimeIcons para iconografía.
- Leaflet para visualización cartográfica.

## Problemas comunes

### Error al ejecutar `npm ci`

Si aparece un mensaje indicando que falta `package-lock.json`:

```text
The npm ci command can only install with an existing package-lock.json
```

ejecute:

```bash
npm install
```

para regenerar el archivo y vuelva a intentar.

### PowerShell bloquea npm

Si Windows muestra un error similar a:

```text
npm.ps1 porque la ejecución de scripts está deshabilitada
```

puede ejecutar:

```powershell
npm.cmd install
```

o habilitar scripts para el usuario actual:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error EPERM durante la instalación

Si aparece un error similar a:

```text
EPERM: operation not permitted
```

cierre cualquier proceso de Node.js, VS Code o terminales que estén utilizando el proyecto y vuelva a ejecutar:

```bash
npm install
```

