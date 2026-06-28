import env from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import app from "./app.js";

const host = "0.0.0.0";

const server = app.listen(env.PORT, host, () => {
  console.log(`API lista en http://${host}:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`Recibido ${signal}. Cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
