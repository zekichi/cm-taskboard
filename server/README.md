# CM Taskboard API

Backend Node.js + Express + Prisma para CM Taskboard.

## Stack

- Express
- Prisma ORM
- SQLite en desarrollo
- JWT para autenticación
- Zod para validación

## Variables de entorno

Revisar `.env.example`.

## Levantar backend

1. `npm install`
2. `npm run prisma:migrate -- --name init`
3. `npm run prisma:seed`
4. `npm run dev:server`

Usuario seed:

- Email: `demo@cmtaskboard.local`
- Password: `Demo1234!`

## Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Preparado para PostgreSQL

El proyecto usa Prisma y estructura desacoplada por capas. Para pasar a PostgreSQL:

1. Cambiar `provider` en `server/prisma/schema.prisma` a `"postgresql"`.
2. Ajustar `DATABASE_URL` a una URL PostgreSQL real.
3. Ejecutar migraciones con `npm run prisma:deploy`.
