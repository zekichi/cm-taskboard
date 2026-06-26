import bcrypt from "bcryptjs";

import { AppError } from "./errors.js";
import { prisma } from "./prisma.js";

export const ROLES = ["OWNER", "ADMIN", "MANAGER", "MEMBER"];
export const SPECIALTIES = [
  "Copywriter",
  "Diseñador",
  "Editor",
  "Community Manager",
  "Social Media Manager",
];

const roleRank = {
  OWNER: 4,
  ADMIN: 3,
  MANAGER: 2,
  MEMBER: 1,
};

export function canManageMembers(role) {
  return roleRank[role] >= roleRank.ADMIN;
}

export function canCreateTeams(role) {
  return roleRank[role] >= roleRank.ADMIN;
}

export function canManageTasks(role) {
  return roleRank[role] >= roleRank.MANAGER;
}

export function canAssignTasks(role) {
  return roleRank[role] >= roleRank.MANAGER;
}

export function assertRoleAllowed(actorRole, targetRole) {
  if (actorRole === "OWNER") {
    return;
  }

  if (targetRole === "OWNER" || roleRank[targetRole] >= roleRank[actorRole]) {
    throw new AppError(
      "No tienes permisos para asignar ese rol",
      403,
      "ROLE_NOT_ALLOWED"
    );
  }
}

export async function getOrganizationMembership(userId, organizationId) {
  return prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
      organization: true,
    },
  });
}

export async function requireOrganizationMembership(userId, organizationId) {
  const membership = await getOrganizationMembership(userId, organizationId);

  if (!membership) {
    throw new AppError(
      "No perteneces a esta organización",
      403,
      "ORG_FORBIDDEN"
    );
  }

  return membership;
}

export async function requireOrganizationPermission(
  userId,
  organizationId,
  predicate,
  errorMessage = "No tienes permisos para esta acción"
) {
  const membership = await requireOrganizationMembership(userId, organizationId);

  if (!predicate(membership.role)) {
    throw new AppError(errorMessage, 403, "ORG_PERMISSION_DENIED");
  }

  return membership;
}

export async function requireTeamMembership(userId, teamId) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
      team: true,
    },
  });

  if (!membership) {
    throw new AppError("No perteneces a este equipo", 403, "TEAM_FORBIDDEN");
  }

  return membership;
}

export async function findOrCreateUserByEmail(email, name) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { user: existing, created: false, temporaryPassword: null };
  }

  const temporaryPassword = "ChangeMe123!";
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      passwordHash,
    },
  });

  return { user, created: true, temporaryPassword };
}
