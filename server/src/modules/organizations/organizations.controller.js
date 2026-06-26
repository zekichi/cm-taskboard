import { sendSuccess } from "../../lib/http.js";
import {
  serializeOrganization,
  serializeOrganizationMember,
} from "../../lib/workspace-serializer.js";
import {
  addOrganizationMember,
  createOrganizationForUser,
  getOrganizationForUser,
  listOrganizationsForUser,
  removeOrganizationMember,
  updateOrganizationMember,
} from "./organizations.service.js";

function parseId(value, name) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`${name} inválido`);
    error.status = 400;
    throw error;
  }
  return id;
}

export async function listOrganizationsController(req, res) {
  const organizations = await listOrganizationsForUser(req.user.id);
  return sendSuccess(res, organizations.map(serializeOrganization));
}

export async function createOrganizationController(req, res) {
  const organization = await createOrganizationForUser(req.user.id, req.validatedBody);
  return sendSuccess(res, serializeOrganization(organization), 201);
}

export async function getOrganizationController(req, res) {
  const organizationId = parseId(req.params.organizationId, "Organización");
  const organization = await getOrganizationForUser(req.user.id, organizationId);
  return sendSuccess(res, serializeOrganization(organization));
}

export async function addOrganizationMemberController(req, res) {
  const organizationId = parseId(req.params.organizationId, "Organización");
  const result = await addOrganizationMember(
    req.user.id,
    organizationId,
    req.validatedBody
  );
  return sendSuccess(
    res,
    {
      member: serializeOrganizationMember(result.member),
      createdUser: result.createdUser,
      temporaryPassword: result.temporaryPassword,
    },
    201
  );
}

export async function updateOrganizationMemberController(req, res) {
  const organizationId = parseId(req.params.organizationId, "Organización");
  const memberId = parseId(req.params.memberId, "Miembro");
  const member = await updateOrganizationMember(
    req.user.id,
    organizationId,
    memberId,
    req.validatedBody
  );
  return sendSuccess(res, serializeOrganizationMember(member));
}

export async function removeOrganizationMemberController(req, res) {
  const organizationId = parseId(req.params.organizationId, "Organización");
  const memberId = parseId(req.params.memberId, "Miembro");
  const result = await removeOrganizationMember(req.user.id, organizationId, memberId);
  return sendSuccess(res, result);
}
