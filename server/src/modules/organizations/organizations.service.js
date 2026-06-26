import {
  assertRoleAllowed,
  canCreateTeams,
  canManageMembers,
  findOrCreateUserByEmail,
  requireOrganizationMembership,
  requireOrganizationPermission,
} from "../../lib/access-control.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

export function listOrganizationsForUser(userId) {
  return prisma.organization.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: organizationInclude,
    orderBy: { name: "asc" },
  });
}

export async function createOrganizationForUser(userId, payload) {
  return prisma.organization.create({
    data: {
      name: payload.name,
      members: {
        create: {
          userId,
          role: "OWNER",
          specialty: "Social Media Manager",
        },
      },
    },
    include: organizationInclude,
  });
}

export async function getOrganizationForUser(userId, organizationId) {
  await requireOrganizationMembership(userId, organizationId);
  return prisma.organization.findUnique({
    where: { id: organizationId },
    include: organizationInclude,
  });
}

export async function addOrganizationMember(actorUserId, organizationId, payload) {
  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    organizationId,
    canManageMembers,
    "No puedes invitar miembros a esta organización"
  );
  assertRoleAllowed(actorMembership.role, payload.role);

  const { user, created, temporaryPassword } = await findOrCreateUserByEmail(
    payload.email,
    payload.name
  );

  const existing = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    throw new AppError("El usuario ya pertenece a la organización", 409, "ORG_MEMBER_EXISTS");
  }

  const member = await prisma.organizationMember.create({
    data: {
      organizationId,
      userId: user.id,
      role: payload.role,
      specialty: payload.specialty ?? null,
    },
    include: memberInclude,
  });

  return { member, createdUser: created, temporaryPassword };
}

export async function updateOrganizationMember(
  actorUserId,
  organizationId,
  memberId,
  payload
) {
  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    organizationId,
    canManageMembers,
    "No puedes cambiar roles en esta organización"
  );

  const target = await prisma.organizationMember.findFirst({
    where: { id: memberId, organizationId },
  });

  if (!target) {
    throw new AppError("Miembro no encontrado", 404, "ORG_MEMBER_NOT_FOUND");
  }

  if (payload.role) {
    assertRoleAllowed(actorMembership.role, payload.role);
    assertRoleAllowed(actorMembership.role, target.role);
  }

  return prisma.organizationMember.update({
    where: { id: memberId },
    data: {
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.specialty !== undefined ? { specialty: payload.specialty } : {}),
    },
    include: memberInclude,
  });
}

export async function removeOrganizationMember(actorUserId, organizationId, memberId) {
  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    organizationId,
    canManageMembers,
    "No puedes eliminar miembros de esta organización"
  );

  const target = await prisma.organizationMember.findFirst({
    where: { id: memberId, organizationId },
  });

  if (!target) {
    throw new AppError("Miembro no encontrado", 404, "ORG_MEMBER_NOT_FOUND");
  }

  assertRoleAllowed(actorMembership.role, target.role);

  await prisma.organizationMember.delete({ where: { id: memberId } });
  return { id: memberId };
}

export async function assertCanCreateTeam(userId, organizationId) {
  return requireOrganizationPermission(
    userId,
    organizationId,
    canCreateTeams,
    "No puedes crear equipos en esta organización"
  );
}

const userSelect = {
  id: true,
  email: true,
  name: true,
};

const memberInclude = {
  user: { select: userSelect },
};

const teamInclude = {
  members: {
    include: memberInclude,
    orderBy: { createdAt: "asc" },
  },
};

const organizationInclude = {
  members: {
    include: memberInclude,
    orderBy: { createdAt: "asc" },
  },
  teams: {
    include: teamInclude,
    orderBy: { name: "asc" },
  },
};
