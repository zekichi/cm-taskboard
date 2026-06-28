# CM Taskboard

CM Taskboard es una app React/Vite con API Node/Express, JWT y Prisma. Está preparada para deploy gratuito con:

- Frontend: Vercel
- Backend: Render
- Base de datos: Neon PostgreSQL

Repositorio GitHub:

```text
https://github.com/zekichi/cm-taskboard
```

URLs de producción:

```text
Frontend Vercel: pendiente de crear en Vercel
Backend Render: pendiente de crear en Render
Health backend: <URL_RENDER>/api/health
```

## Variables De Entorno

Backend Render:

- `DATABASE_URL`: URL PostgreSQL real de Neon, con `sslmode=require`.
- `JWT_SECRET`: secreto largo, privado y distinto de `change-me-in-production`.
- `JWT_EXPIRES_IN`: `7d`.
- `CORS_ORIGIN`: temporalmente `http://localhost:5173`; luego la URL exacta de Vercel.
- `NODE_ENV`: `production`.
- `PORT`: Render lo inyecta, el proyecto acepta `4000`.

Frontend Vercel:

- `VITE_API_URL`: URL pública del backend Render con `/api`, por ejemplo `https://cm-taskboard.onrender.com/api`.

## Desarrollo

1. `npm install`
2. Configurar `.env` con una base PostgreSQL de Neon.
3. `npm run prisma:deploy`
4. `npm run seed:prod`
5. `npm run dev`

## Neon

1. Entrar al proyecto Neon.
2. Abrir `Connect`.
3. Usar branch `main`, database `neondb` y role `neondb_owner`.
4. Para migraciones Prisma, usar la conexión directa, sin `-pooler`.
5. Confirmar que la URL tenga `sslmode=require`.
6. Pegar esa URL como `DATABASE_URL` local y en Render.

## Render

Crear un Web Service apuntando a este repo.

Build command:

```bash
npm ci && npm run prisma:generate
```

Start command:

```bash
npm run start:prod
```

El start command ejecuta migraciones con `prisma migrate deploy` antes de iniciar la API.

Para cargar o recargar el demo CTS:

```bash
npm run seed:prod
```

## Vercel

Crear proyecto Vercel desde este repo.

Build command:

```bash
npm run build:client
```

Output directory:

```bash
dist
```

Configurar:

```env
VITE_API_URL=https://cm-taskboard.onrender.com/api
```

Después de obtener la URL final de Vercel, volver a Render y cambiar:

```env
CORS_ORIGIN=<URL_FINAL_DE_VERCEL>
```

## Credenciales Demo CTS

Todos usan la contraseña:

```text
CtsDemo2026!
```

Usuarios:

- Valentina Ríos: `valentina.rios@cts-demo.local`, rol `OWNER`, especialidad `Social Media Manager`
- Mateo Silva: `mateo.silva@cts-demo.local`, rol `ADMIN`, especialidad `Diseñador`
- Lara Gómez: `lara.gomez@cts-demo.local`, rol `ADMIN`, especialidad `Copywriter`

El seed crea la organización `CTS`, el equipo `CTS`, los tres usuarios y tareas demo asignadas.

## Verificación

Local:

```bash
npm run prisma:generate
npm run build
```

Producción, con Neon real:

```bash
npm run prisma:deploy
npm run seed:prod
```

Flujo esperado:

- Login de los tres usuarios demo.
- Listado de organización/equipo CTS.
- Creación, edición, asignación y eliminación de tareas.
- Frontend Vercel consumiendo backend Render.
