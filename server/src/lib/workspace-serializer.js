export function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export function serializeOrganizationMember(member) {
  return {
    id: member.id,
    organizationId: member.organizationId,
    userId: member.userId,
    role: member.role,
    specialty: member.specialty,
    user: serializeUser(member.user),
  };
}

export function serializeTeamMember(member) {
  return {
    id: member.id,
    teamId: member.teamId,
    userId: member.userId,
    role: member.role,
    specialty: member.specialty,
    user: serializeUser(member.user),
  };
}

export function serializeTeam(team) {
  return {
    id: team.id,
    name: team.name,
    organizationId: team.organizationId,
    members: team.members?.map(serializeTeamMember) || [],
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}

export function serializeOrganization(organization) {
  return {
    id: organization.id,
    name: organization.name,
    members: organization.members?.map(serializeOrganizationMember) || [],
    teams: organization.teams?.map(serializeTeam) || [],
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
}
