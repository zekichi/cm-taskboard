import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    email: "demo@cmtaskboard.local",
    password: "Demo1234!",
    name: "Usuario Demo",
    role: "OWNER",
    specialty: "Social Media Manager",
  },
  {
    email: "copy@cmtaskboard.local",
    password: "Demo1234!",
    name: "Copy Demo",
    role: "MANAGER",
    specialty: "Copywriter",
  },
  {
    email: "design@cmtaskboard.local",
    password: "Demo1234!",
    name: "Diseño Demo",
    role: "MEMBER",
    specialty: "Diseñador",
  },
];

const taskSeeds = [
  {
    title: "Planificar calendario de contenidos",
    description: "Definir temas y fechas para la próxima semana.",
    platform: "Instagram",
    status: "pendiente",
    dueDate: "2026-05-20",
    priority: "alta",
    teamName: "Contenido orgánico",
    assignedEmail: "copy@cmtaskboard.local",
  },
  {
    title: "Diseñar carrusel del lanzamiento",
    description: "Preparar piezas y copy para aprobación.",
    platform: "LinkedIn",
    status: "en diseño",
    dueDate: "2026-05-22",
    priority: "media",
    teamName: "Contenido orgánico",
    assignedEmail: "design@cmtaskboard.local",
  },
  {
    title: "Programar video corto",
    description: "Dejar publicación lista para el viernes.",
    platform: "TikTok",
    status: "aprobado",
    dueDate: "2026-05-23",
    priority: "baja",
    teamName: "Campañas pagas",
    assignedEmail: "demo@cmtaskboard.local",
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
    update: { name: "CM Studio" },
    create: { name: "CM Studio" },
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

  const teamSeeds = [
    { name: "Contenido orgánico", roleByEmail: users },
    { name: "Campañas pagas", roleByEmail: users.slice(0, 2) },
  ];

  const teams = new Map();
  for (const teamSeed of teamSeeds) {
    const team = await prisma.team.create({
      data: {
        name: teamSeed.name,
        organizationId: organization.id,
      },
    });
    teams.set(team.name, team);

    for (const memberSeed of teamSeed.roleByEmail) {
      const user = createdUsers.get(memberSeed.email);
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: memberSeed.role,
          specialty: memberSeed.specialty,
        },
      });
    }
  }

  const creator = createdUsers.get("demo@cmtaskboard.local");
  await prisma.task.createMany({
    data: taskSeeds.map((task) => ({
      title: task.title,
      description: task.description,
      platform: task.platform,
      status: task.status,
      dueDate: toDateOnly(task.dueDate),
      priority: task.priority,
      organizationId: organization.id,
      teamId: teams.get(task.teamName).id,
      userId: creator.id,
      assignedToId: createdUsers.get(task.assignedEmail).id,
    })),
  });

  console.log("Seed completado.");
  console.log("Organizacion demo: CM Studio");
  console.log("Usuario demo: demo@cmtaskboard.local");
  console.log("Password demo: Demo1234!");
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
