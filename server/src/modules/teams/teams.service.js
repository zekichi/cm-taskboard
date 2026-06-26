import {
  assertCanCreateTeam,
  getOrganizationForUser,
} from "../organizations/organizations.service.js";
import {
  assertRoleAllowed,
  canManageMembers,
  requireOrganizationPermission,
  requireTeamMembership,
} from "../../lib/access-control.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

const userSelect = { id: true, email: true, name: true };
const memberInclude = { user: { select: userSelect } };
const teamInclude = {
  members: {
    include: memberInclude,
    orderBy: { createdAt: "asc" },
  },
};

export async function listTeamsForUser(userId, organizationId) {
  await getOrganizationForUser(userId, organizationId);
  return prisma.team.findMany({
    where: { organizationId },
    include: teamInclude,
    orderBy: { name: "asc" },
  });
}

export async function createTeamForUser(userId, payload) {
  await assertCanCreateTeam(userId, payload.organizationId);
  return prisma.team.create({
    data: {
      name: payload.name,
      organizationId: payload.organizationId,
    },
    include: teamInclude,
  });
}

export async function addTeamMember(actorUserId, teamId, payload) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    throw new AppError("Equipo no encontrado", 404, "TEAM_NOT_FOUND");
  }

  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    team.organizationId,
    canManageMembers,
    "No puedes administrar miembros de este equipo"
  );
  assertRoleAllowed(actorMembership.role, payload.role);

  const orgMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: team.organizationId,
        userId: payload.userId,
      },
    },
  });

  if (!orgMember) {
    throw new AppError(
      "El usuario debe pertenecer a la organización antes de sumarlo al equipo",
      400,
      "ORG_MEMBER_REQUIRED"
    );
  }

  return prisma.teamMember.upsert({
    where: {
      teamId_userId: {
        teamId,
        userId: payload.userId,
      },
    },
    update: {
      role: payload.role,
      specialty: payload.specialty ?? orgMember.specialty,
    },
    create: {
      teamId,
      userId: payload.userId,
      role: payload.role,
      specialty: payload.specialty ?? orgMember.specialty,
    },
    include: memberInclude,
  });
}

export async function updateTeamMember(actorUserId, teamId, memberId, payload) {
  const teamMember = await prisma.teamMember.findFirst({
    where: { id: memberId, teamId },
    include: { team: true },
  });

  if (!teamMember) {
    throw new AppError("Miembro de equipo no encontrado", 404, "TEAM_MEMBER_NOT_FOUND");
  }

  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    teamMember.team.organizationId,
    canManageMembers,
    "No puedes cambiar roles de este equipo"
  );

  if (payload.role) {
    assertRoleAllowed(actorMembership.role, payload.role);
    assertRoleAllowed(actorMembership.role, teamMember.role);
  }

  return prisma.teamMember.update({
    where: { id: memberId },
    data: {
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.specialty !== undefined ? { specialty: payload.specialty } : {}),
    },
    include: memberInclude,
  });
}

export async function removeTeamMember(actorUserId, teamId, memberId) {
  const teamMember = await prisma.teamMember.findFirst({
    where: { id: memberId, teamId },
    include: { team: true },
  });

  if (!teamMember) {
    throw new AppError("Miembro de equipo no encontrado", 404, "TEAM_MEMBER_NOT_FOUND");
  }

  const actorMembership = await requireOrganizationPermission(
    actorUserId,
    teamMember.team.organizationId,
    canManageMembers,
    "No puedes eliminar miembros de este equipo"
  );
  assertRoleAllowed(actorMembership.role, teamMember.role);

  await prisma.teamMember.delete({ where: { id: memberId } });
  return { id: memberId };
}

export async function assertTeamAccess(userId, teamId) {
  return requireTeamMembership(userId, teamId);
}
