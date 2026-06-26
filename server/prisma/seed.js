import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoPassword = "CtsDemo2026!";

const users = [
  {
    email: "valentina.rios@cts-demo.local",
    password: demoPassword,
    name: "Valentina Ríos",
    role: "OWNER",
    specialty: "Social Media Manager",
  },
  {
    email: "mateo.silva@cts-demo.local",
    password: demoPassword,
    name: "Mateo Silva",
    role: "ADMIN",
    specialty: "Diseñador",
  },
  {
    email: "lara.gomez@cts-demo.local",
    password: demoPassword,
    name: "Lara Gómez",
    role: "ADMIN",
    specialty: "Copywriter",
  },
];

const taskSeeds = [
  {
    title: "Calendario editorial CTS",
    description: "Armar el calendario semanal con piezas, copies y responsables.",
    platform: "Instagram",
    status: "pendiente",
    dueDate: "2026-07-03",
    priority: "alta",
    assignedEmail: "valentina.rios@cts-demo.local",
  },
  {
    title: "Diseño de carrusel institucional",
    description: "Preparar una propuesta visual para la campaña CTS.",
    platform: "LinkedIn",
    status: "en diseño",
    dueDate: "2026-07-05",
    priority: "media",
    assignedEmail: "mateo.silva@cts-demo.local",
  },
  {
    title: "Copy para lanzamiento de servicio",
    description: "Redactar versiones cortas para stories y feed.",
    platform: "Instagram",
    status: "aprobado",
    dueDate: "2026-07-06",
    priority: "media",
    assignedEmail: "lara.gomez@cts-demo.local",
  },
];

function toDateOnly(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

async function main() {
  const createdUsers = new Map();

  for (const userSeed of users) {
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
    createdUsers.set(user.email, { ...user, seed: userSeed });
  }

  const organization = await prisma.organization.upsert({
    where: { id: 1 },
    update: { name: "CTS" },
    create: { name: "CTS" },
  });

  await prisma.task.deleteMany({ where: { organizationId: organization.id } });
  await prisma.teamMember.deleteMany({
    where: { team: { organizationId: organization.id } },
  });
  await prisma.team.deleteMany({ where: { organizationId: organization.id } });
  await prisma.organizationMember.deleteMany({
    where: { organizationId: organization.id },
  });

  for (const user of createdUsers.values()) {
    await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: user.seed.role,
        specialty: user.seed.specialty,
      },
    });
  }

  const team = await prisma.team.create({
    data: {
      name: "CTS",
      organizationId: organization.id,
    },
  });

  for (const user of createdUsers.values()) {
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: user.seed.role,
        specialty: user.seed.specialty,
      },
    });
  }

  const creator = createdUsers.get("valentina.rios@cts-demo.local");
  await prisma.task.createMany({
    data: taskSeeds.map((task) => ({
      title: task.title,
      description: task.description,
      platform: task.platform,
      status: task.status,
      dueDate: toDateOnly(task.dueDate),
      priority: task.priority,
      organizationId: organization.id,
      teamId: team.id,
      userId: creator.id,
      assignedToId: createdUsers.get(task.assignedEmail).id,
    })),
  });

  console.log("Seed completado.");
  console.log("Organizacion demo: CTS");
  console.log("Equipo demo: CTS");
  console.log(`Password demo para los 3 usuarios: ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
