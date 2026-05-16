import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userSeed = {
  email: "demo@cmtaskboard.local",
  password: "Demo1234!",
  name: "Usuario Demo",
};

const taskSeeds = [
  {
    title: "Planificar calendario de contenidos",
    description: "Definir temas y fechas para la próxima semana.",
    platform: "Instagram",
    status: "pendiente",
    dueDate: "2026-05-20",
    priority: "alta",
  },
  {
    title: "Diseñar carrusel del lanzamiento",
    description: "Preparar piezas y copy para aprobación.",
    platform: "LinkedIn",
    status: "en diseño",
    dueDate: "2026-05-22",
    priority: "media",
  },
  {
    title: "Programar video corto",
    description: "Dejar publicación lista para el viernes.",
    platform: "TikTok",
    status: "aprobado",
    dueDate: "2026-05-23",
    priority: "baja",
  },
];

function toDateOnly(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

async function main() {
  const passwordHash = await bcrypt.hash(userSeed.password, 10);

  const user = await prisma.user.upsert({
    where: { email: userSeed.email },
    update: {
      passwordHash,
      name: userSeed.name,
    },
    create: {
      email: userSeed.email,
      passwordHash,
      name: userSeed.name,
    },
  });

  await prisma.task.deleteMany({ where: { userId: user.id } });

  await prisma.task.createMany({
    data: taskSeeds.map((task) => ({
      title: task.title,
      description: task.description,
      platform: task.platform,
      status: task.status,
      dueDate: toDateOnly(task.dueDate),
      priority: task.priority,
      userId: user.id,
    })),
  });

  console.log("Seed completado.");
  console.log(`Usuario demo: ${userSeed.email}`);
  console.log(`Password demo: ${userSeed.password}`);
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
