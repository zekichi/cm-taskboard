# CM Taskboard

Frontend React/Vite + backend Node/Express con Prisma.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

1. `npm install`
2. Copiar variables: `Copy-Item .env.example .env`
3. Crear base y seed:
   - `npm run prisma:migrate -- --name init`
   - `npm run prisma:seed`

## Desarrollo

- Frontend + backend: `npm run dev`
- Solo backend: `npm run dev:server`
- Solo frontend: `npm run dev:client`

## Producción

- Build: `npm run build`
- Ejecutar API: `npm start`
- Aplicar migraciones y ejecutar API: `npm run start:prod`

## Usuario demo

- Email: `demo@cmtaskboard.local`
- Password: `Demo1234!`
