export const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Miembro",
};

export const ROLE_PERMISSIONS = {
  OWNER: {
    manageTeams: true,
    manageMembers: true,
    manageRoles: true,
    manageTasks: true,
    assignTasks: true,
    viewTasks: true,
  },
  ADMIN: {
    manageTeams: true,
    manageMembers: true,
    manageRoles: true,
    manageTasks: true,
    assignTasks: true,
    viewTasks: true,
  },
  MANAGER: {
    manageTeams: false,
    manageMembers: false,
    manageRoles: false,
    manageTasks: true,
    assignTasks: true,
    viewTasks: true,
  },
  MEMBER: {
    manageTeams: false,
    manageMembers: false,
    manageRoles: false,
    manageTasks: false,
    assignTasks: false,
    viewTasks: true,
  },
};

export function getPermissions(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.MEMBER;
}
