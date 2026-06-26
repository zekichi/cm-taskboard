import { AppError } from "../../lib/errors.js";
import { sendSuccess } from "../../lib/http.js";
import { serializeTeam, serializeTeamMember } from "../../lib/workspace-serializer.js";
import {
  addTeamMember,
  createTeamForUser,
  listTeamsForUser,
  removeTeamMember,
  updateTeamMember,
} from "./teams.service.js";

function parseId(value, name) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`${name} inválido`, 400, "INVALID_ID");
  }
  return id;
}

export async function listTeamsController(req, res) {
  const organizationId = parseId(req.query.organizationId, "Organización");
  const teams = await listTeamsForUser(req.user.id, organizationId);
  return sendSuccess(res, teams.map(serializeTeam));
}

export async function createTeamController(req, res) {
  const team = await createTeamForUser(req.user.id, req.validatedBody);
  return sendSuccess(res, serializeTeam(team), 201);
}

export async function addTeamMemberController(req, res) {
  const teamId = parseId(req.params.teamId, "Equipo");
  const member = await addTeamMember(req.user.id, teamId, req.validatedBody);
  return sendSuccess(res, serializeTeamMember(member), 201);
}

export async function updateTeamMemberController(req, res) {
  const teamId = parseId(req.params.teamId, "Equipo");
  const memberId = parseId(req.params.memberId, "Miembro");
  const member = await updateTeamMember(req.user.id, teamId, memberId, req.validatedBody);
  return sendSuccess(res, serializeTeamMember(member));
}

export async function removeTeamMemberController(req, res) {
  const teamId = parseId(req.params.teamId, "Equipo");
  const memberId = parseId(req.params.memberId, "Miembro");
  const result = await removeTeamMember(req.user.id, teamId, memberId);
  return sendSuccess(res, result);
}
