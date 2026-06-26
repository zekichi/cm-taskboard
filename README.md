# CM Taskboard

CM Taskboard es una app React/Vite con API Node/Express, JWT y Prisma. Está preparada para deploy gratuito con:

- Frontend: Vercel
- Backend: Render
- Base de datos: Neon PostgreSQL

## Variables de entorno

Usar `.env.example` para desarrollo y `.env.production.example` para producción.

Backend Render:

- `DATABASE_URL`: URL PostgreSQL de Neon, con `sslmode=require`
- `JWT_SECRET`: secreto largo y privado
- `JWT_EXPIRES_IN`: por ejemplo `7d`
- `CORS_ORIGIN`: URL exacta del frontend en Vercel, por ejemplo `https://cm-taskboard.vercel.app`
- `PORT`: Render lo inyecta, pero el proyecto acepta `4000`
- `NODE_ENV`: `production`

Frontend Vercel:

- `VITE_API_URL`: URL exacta del backend Render con `/api`, por ejemplo `https://cm-taskboard-api.onrender.com/api`

## Desarrollo

1. `npm install`
2. Configurar `.env` con una base PostgreSQL de Neon.
3. `npm run prisma:deploy`
4. `npm run prisma:seed`
5. `npm run dev`

## Deploy En Neon

1. Crear un proyecto gratuito en Neon.
2. Copiar la connection string pooled o directa.
3. Asegurarse de que termine con `?sslmode=require`.
4. Usarla como `DATABASE_URL` en Render y localmente cuando se quiera migrar/seedear producción.

## Deploy En Render

Crear un Web Service apuntando a este repo.

Build command:

```bash
npm install && npm run prisma:generate
```

Start command:

```bash
npm run start:prod
```

Luego ejecutar el seed desde Render Shell o local con la `DATABASE_URL` de Neon:

```bash
npm run seed:prod
```

## Deploy En Vercel

Crear proyecto Vercel desde este repo.

Build command:

```bash
npm run build:client
```

Output directory:

```bash
dist
```

Configurar `VITE_API_URL` con la URL pública de Render.

Después de obtener la URL de Vercel, volver a Render y ajustar `CORS_ORIGIN` a esa URL exacta.

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
